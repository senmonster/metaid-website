"use client";

import {
	ActionIcon,
	Avatar,
	Box,
	Button,
	Divider,
	LoadingOverlay,
	Modal,
	Skeleton,
	// TextInput,
	Tooltip,
} from "@mantine/core";
import { useClipboard, useDisclosure } from "@mantine/hooks";
import {
	IconCopy,
	IconCopyCheck,
	IconLogout,
	IconWallet,
	// IconSearch,
	// IconSettings,
} from "@tabler/icons-react";
import classes from "./AdminHeader.module.css";
import { Logo } from "../Logo/Logo";
import ThemModeControl from "../ThemeModeControl";
import { metaidService } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";
import { checkMetaletInstalled, conirmMetaletTestnet } from "@/utils/wallet";
import { isEmpty, isNil } from "ramda";
import { errors } from "@/utils/errors";

import {
	UserInfo,
	balanceAtom,
	btcConnectorAtom,
	connectedAtom,
	hasMetaidAtom,
	userInfoAtom,
	walletAtom,
} from "@/store/user";
import { useCallback, useEffect, useState } from "react";
import { BASE_URL } from "@/utils/request";
import cls from "classnames";
import MetaidUserform, { MetaidUserInfo } from "./MetaidUserform";
import { MetaletWalletForBtc, btcConnect } from "@metaid/metaid";
import { IBtcConnector } from "@metaid/metaid";
interface Props {
	burger?: React.ReactNode;
}

export default function AdminHeader({ burger }: Props) {
	const [connected, setConnected] = useRecoilState(connectedAtom);
	const [wallet, setWallet] = useRecoilState(walletAtom);
	const [btcConnector, setBtcConnector] = useRecoilState<IBtcConnector | null>(btcConnectorAtom);
	const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);
	const [metaidFormOpened, metaidFormHandler] = useDisclosure(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [balance, setBalance] = useRecoilState(balanceAtom);
	const [hasMetaid, sethasMetaid] = useRecoilState(hasMetaidAtom);

	const clipboard = useClipboard({ timeout: 3000 });
	const { data, isLoading } = useQuery({
		queryKey: ["pin", "list", 1],
		queryFn: () => metaidService.getPinList({ page: 1, size: 1 }),
	});

	const handleBeforeUnload = async () => {
		console.log("refresh ....");
		if (hasMetaid && !isNil(wallet)) {
			const _btcConnector = await btcConnect(wallet);
			setUserInfo(_btcConnector.user);
			console.log("refetch user", _btcConnector.user);
		}
	};

	const wrapHandleBeforeUnload = useCallback(handleBeforeUnload, [
		wallet,
		hasMetaid,
		setUserInfo,
	]);

	useEffect(() => {
		wrapHandleBeforeUnload();
	}, [wrapHandleBeforeUnload]);

	const MetaidInfo = ({
		hasMetaid,
		userInfo,
	}: {
		hasMetaid: boolean;
		userInfo: UserInfo | null;
	}) => {
		if (hasMetaid && !isNil(userInfo)) {
			return (
				<Tooltip label="Click to edit your detail">
					<Avatar
						onClick={metaidFormHandler.open}
						radius="xl"
						size={"md"}
						src={!isEmpty(userInfo?.avatar) ? BASE_URL + userInfo.avatar : null}
						className="absolute right-0 bottom-[2px] shadow-md cursor-pointer"
					>
						{(userInfo?.name ?? "").slice(0, 1)}
					</Avatar>
				</Tooltip>
			);
		}
		return (
			<Button variant="light" onClick={metaidFormHandler.open}>
				Create MetaID
			</Button>
		);
	};
	const onLogout = () => {
		setConnected(false);
		setBtcConnector(null);
		setUserInfo(null);
		window.metaidwallet.removeListener("accountsChanged");
		window.metaidwallet.removeListener("networkChanged");
	};

	const onWalletConnectStart = async () => {
		await checkMetaletInstalled();
		const _wallet = await MetaletWalletForBtc.create();
		setWallet(_wallet);
		setBalance(((await _wallet?.getBalance())?.confirmed ?? 0).toString());
		await conirmMetaletTestnet();
		if (isNil(_wallet?.address)) {
			toast.error(errors.NO_METALET_LOGIN);
			throw new Error(errors.NO_METALET_LOGIN);
		}
		setConnected(true);

		// add event listenr for accountsChanged networkChanged
		window.metaidwallet.on("accountsChanged", () => {
			onLogout();
			toast.error(
				"Wallet Account Changed ---- You have been automatically logged out of your current BitBuzz account. Please login again..."
			);
		});
		window.metaidwallet.on("networkChanged", async (network: string) => {
			console.log("network", network);
			if (network !== "testnet") {
				onLogout();
				toast.error(
					"Wallet Network Changed ---- You have been automatically logged out of your current BitBuzz account. Please Switch to Testnet login again..."
				);
				await window.metaidwallet.switchNetwork("testnet");
			}
		});
		// window.addEventListener("beforeunload", (e) => {
		// 	const confirmMessage = "oos";
		// 	e.returnValue = confirmMessage;
		// 	return confirmMessage;
		// });

		//////////////////////////
		const _btcConnector = await btcConnect(_wallet);
		console.log("_btcConnector", _btcConnector, _btcConnector.hasMetaid());
		console.log("_wallet", _wallet, await _wallet.getBalance());
		setBtcConnector(_btcConnector);

		const _hasMetaid = _btcConnector?.hasMetaid() ?? false;
		sethasMetaid(_hasMetaid);

		// const doc_modal = document.getElementById(
		//   'create_metaid_modal'
		// ) as HTMLDialogElement;
		// doc_modal.showModal();
		// console.log("getUser", await _btcConnector.getUser());
		if (_hasMetaid) {
			setUserInfo(_btcConnector.user);
			console.log("user now", _btcConnector.user);
			console.log("your btc address: ", _btcConnector.address);
		}
	};

	const handleSubmitMetaId = async (userInfo: MetaidUserInfo) => {
		// console.log("userInfo", userInfo);

		setBalance(((await window.metaidwallet?.btc.getBalance())?.confirmed ?? 0).toString());
		setIsSubmitting(true);

		if (hasMetaid) {
			const res = await btcConnector!.updatUserInfo({ ...userInfo }).catch((error) => {
				console.log("error", error);
				const errorMessage = (error as any)?.message;
				const toastMessage = errorMessage?.includes("Cannot read properties of undefined")
					? "User Canceled"
					: errorMessage;
				toast.error(toastMessage);
				setIsSubmitting(false);
				// setUserInfoStartValues(userInfoStartValues);
				//   setUserInfo(await btcConnector.getUser());
			});
			console.log("update res", res);
			if (res) {
				console.log("after create", await btcConnector!.getUser());
				setUserInfo(await btcConnector!.getUser());
				setIsSubmitting(false);
				toast.success("Updating Your Profile Successfully!");
			}
		} else {
			const res = await btcConnector!.createMetaid({ ...userInfo }).catch((error: any) => {
				setIsSubmitting(false);

				const errorMessage = TypeError(error).message;

				const toastMessage = errorMessage?.includes("Cannot read properties of undefined")
					? "User Canceled"
					: errorMessage;
				toast.error(toastMessage);
			});

			if (isNil(res?.metaid)) {
				toast.error("Create Failed");
			} else {
				toast.success("Successfully created!Now you can connect your wallet again!");
				sethasMetaid(true);
			}
		}

		setIsSubmitting(false);
		metaidFormHandler.close();
		// await onWalletConnectStart();
	};
	// console.log("useinfo hasMetaid", userInfo, hasMetaid);
	return (
		<>
			{isLoading ? (
				<Skeleton visible={isLoading} className="w-[80%] h-[60%] mt-3 mx-auto"></Skeleton>
			) : (
				<header className={cls(classes.header, "pt-3 px-3")}>
					{burger && burger}
					<div className="flex items-center gap-12">
						<Logo />
						<Button variant="light" size="xs" radius="lg" className="hidden md:block">
							{`total MetaID: ${data?.Count.metaId}` +
								"    |    " +
								`total Pin: ${data?.Count.Pin}` +
								"    |    " +
								`total Block: ${data?.Count.block}` +
								"    |    " +
								`total APP: ${data?.Count.app}`}
						</Button>
					</div>

					{/* <Box style={{ flex: 1 }} /> */}
					<div className="flex gap-2 items-center">
						{/* <TextInput
            placeholder='Search'
            variant='filled'
            leftSection={<IconSearch size='0.8rem' />}
            style={{}}
          /> */}
						<ThemModeControl />
						<Divider orientation="vertical" className="h-[20px] my-auto !mx-2" />
						{!connected ? (
							<Button
								variant="light"
								onClick={async () => {
									await onWalletConnectStart();
								}}
							>
								Connect Wallet
							</Button>
						) : (
							<div
								className={cls("flex items-center gap-4 relative", {
									"pr-12": hasMetaid,
								})}
							>
								<div className="flex gap-1 text-gray-400 items-center">
									<IconWallet
										style={{ width: "70%", height: "70%" }}
										stroke={1.5}
									/>
									<div>
										{!isNil(wallet?.address) &&
											wallet?.address.slice(0, 4) +
												"..." +
												wallet?.address.slice(-4)}
									</div>

									{!clipboard.copied ? (
										<ActionIcon
											variant={"subtle"}
											color="gray"
											size="lg"
											aria-label="Settings"
										>
											<IconCopy
												className="cursor-pointer"
												style={{ width: "70%", height: "70%" }}
												stroke={1.5}
												onClick={() =>
													clipboard.copy(wallet?.address ?? "")
												}
											/>
										</ActionIcon>
									) : (
										<ActionIcon
											variant={"subtle"}
											color="gray"
											size="lg"
											aria-label="Settings"
										>
											<IconCopyCheck
												className="cursor-pointer"
												style={{ width: "70%", height: "70%" }}
												stroke={1.5}
											/>
										</ActionIcon>
									)}
									<Divider
										orientation="vertical"
										className="h-[20px] my-auto mx-2"
									/>
									<ActionIcon
										variant={"subtle"}
										color="gray"
										size="lg"
										aria-label="Settings"
									>
										<IconLogout
											onClick={onLogout}
											className="cursor-pointer"
											style={{ width: "70%", height: "70%" }}
											stroke={1.5}
										/>
									</ActionIcon>
								</div>
								<MetaidInfo hasMetaid={hasMetaid} userInfo={userInfo} />
							</div>
						)}
					</div>
				</header>
			)}
			<Modal
				opened={metaidFormOpened}
				onClose={metaidFormHandler.close}
				title={hasMetaid ? "Edit MetaID Detail" : "Create MetaID Detail"}
			>
				<Box pos="relative">
					<LoadingOverlay
						visible={isSubmitting}
						zIndex={1000}
						overlayProps={{ radius: "sm", blur: 2 }}
					/>
					{/* ...other content */}
					<MetaidUserform
						onSubmit={handleSubmitMetaId}
						address={wallet?.address ?? ""}
						balance={balance}
						hasMetaid={hasMetaid}
						userInfo={hasMetaid && !isNil(userInfo) ? userInfo : undefined}
					/>
				</Box>
			</Modal>
		</>
	);
}

"use client";

import { ActionIcon, Avatar, Button, Modal, TextInput, Tooltip } from "@mantine/core";
import { useClipboard, useDisclosure } from "@mantine/hooks";
import { IconCopy, IconCopyCheck, IconLogout, IconSearch, IconSettings } from "@tabler/icons-react";
import classes from "./AdminHeader.module.css";
import { Logo } from "../Logo/Logo";
import ThemModeControl from "../ThemeModeControl";
import { metaidService } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import { useRecoilState, useSetRecoilState } from "recoil";
import { checkMetaletInstalled, conirmMetaletTestnet } from "@/utils/wallet";
import { isEmpty, isNil } from "ramda";
import { errors } from "@/utils/errors";
import { IBtcConnector, MetaletWalletForBtc, btcConnect } from "@metaid/metaid";
import { UserInfo, btcConnectorAtom, connectedAtom, userInfoAtom, walletAtom } from "@/store/user";
import { ReactElement } from "react";
import { BASE_URL } from "@/utils/request";

interface Props {
	burger?: React.ReactNode;
}

export function AdminHeader({ burger }: Props) {
	const [connected, setConnected] = useRecoilState(connectedAtom);
	const [wallet, setWallet] = useRecoilState(walletAtom);
	const [btcConnector, setBtcConnector] = useRecoilState(btcConnectorAtom);
	const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);
	const [metaidFormOpened, metaidFormHandler] = useDisclosure(false);
	const clipboard = useClipboard({ timeout: 3000 });

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
		await conirmMetaletTestnet();
		if (isNil(_wallet?.address)) {
			toast.error(errors.NO_METALET_LOGIN, {
				className: "!text-[#DE613F] !bg-[black] border border-[#DE613f] !rounded-lg",
			});
			throw new Error(errors.NO_METALET_LOGIN);
		}

		// add event listenr for accountsChanged networkChanged
		window.metaidwallet.on("accountsChanged", () => {
			onLogout();
			toast.error(
				"Wallet Account Changed ---- You have been automatically logged out of your current BitBuzz account. Please login again...",
				{
					className: "!text-[#DE613F] !bg-[black] border border-[#DE613f] !rounded-lg",
				}
			);
		});
		window.metaidwallet.on("networkChanged", async (network: string) => {
			console.log("network", network);
			if (network !== "testnet") {
				onLogout();
				toast.error(
					"Wallet Network Changed ---- You have been automatically logged out of your current BitBuzz account. Please Switch to Testnet login again...",
					{
						className:
							"!text-[#DE613F] !bg-[black] border border-[#DE613f] !rounded-lg",
					}
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
		const _btcConnector: IBtcConnector = await btcConnect(_wallet);

		setBtcConnector(_btcConnector as IBtcConnector);

		// const doc_modal = document.getElementById(
		//   'create_metaid_modal'
		// ) as HTMLDialogElement;
		// doc_modal.showModal();
		// console.log("getUser", await _btcConnector.getUser());
		if (_btcConnector.hasMetaid()) {
			const resUser = await _btcConnector.getUser();
			console.log("user now", resUser);
			setUserInfo(resUser);
			setConnected(true);
			console.log("your btc address: ", _btcConnector.address);
		}
	};

	const { data } = useQuery({
		queryKey: ["pin", "list", 1],
		queryFn: () => metaidService.getPinList({ page: 1, size: 18 }),
	});

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
						size={"lg"}
						src={!isEmpty(userInfo?.avatar) ? BASE_URL + userInfo.avatar : null}
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

	return (
		<>
			<header className={classes.header}>
				{/* {burger && burger} */}
				<div className="flex items-center gap-2">
					<Logo />
					<Button variant="light" size="xs" radius="lg">
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
					<TextInput
						placeholder="Search"
						variant="filled"
						leftSection={<IconSearch size="0.8rem" />}
						style={{}}
					/>
					<ThemModeControl />
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
						<div className="flex items-center gap-2">
							<div className="flex gap-1 text-gray-400 items-center">
								<div>address:</div>
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
							<MetaidInfo
								hasMetaid={btcConnector?.hasMetaid() ?? false}
								userInfo={userInfo}
							/>
						</div>
					)}
				</div>
			</header>
			<Modal
				opened={metaidFormOpened}
				onClose={metaidFormHandler.close}
				title="Create MetaID Detail"
			>
				{/* Modal content */}
			</Modal>
		</>
	);
}

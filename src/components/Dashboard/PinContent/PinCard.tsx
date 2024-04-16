import { Pin } from "@/utils/api";
import React, { useEffect, useState } from "react";
import {
	ActionIcon,
	Container,
	Divider,
	Skeleton,
	Text,
	Tooltip,
	useMantineColorScheme,
} from "@mantine/core";
import { BASE_URL } from "@/utils/request";
import { count, isEmpty, isNil } from "ramda";
import cls from "classnames";
import { useRouter } from "next/navigation";
import { IconDots, IconHelp } from "@tabler/icons-react";

type Iprops = {
	p?: Pin;
	isLoading?: boolean;
};

const PinCard = ({ p, isLoading = false }: Iprops) => {
	const { colorScheme } = useMantineColorScheme();

	const [netWork, setNetWork] = useState("testnest");
	const getNetWork = async () => {
		setNetWork((await window.metaidwallet.getNetwork()).network);
	};

	useEffect(() => {
		getNetWork();
	}, []);

	const content = isNil(p)
		? ""
		: p.content.length <= 35
		? p.content
		: p.content.slice(0, 35) + "...";

	const router = useRouter();

	const getPopColor = (level: number) => {
		switch (level) {
			case -1:
				return "bg-gray-500";
			case 0:
				return "bg-white text-slate-600";
			case 1:
				return "bg-green-200 text-green-600";
			case 2:
				return "bg-blue-200 text-blue-600";
			case 3:
				return "bg-purple-200 text-purple-600";
			case 4:
				return "bg-orange-200 text-orange-600";
			case 5:
				return "bg-yellow-200 text-yellow-600";
			case 6:
				return "bg-red-200 text-red-600";
			case 7:
				return "animate-pulse bg-gradient-to-r from-orange-400 via-yellow-400 to-red-400 text-yellow-800";
			case 8:
				return "animate-pulse bg-gradient-to-r from-black via-gray-700 to-gray-500";
			default:
				return "";
		}
	};

	const popToolTip: React.ReactNode = (
		<div className="flex flex-col gap-3 text-wrap break-all">
			<div>
				This value represents the rarity level of the current pin, with higher levels being
				rarer. The following are the colors corresponding to different rarity levels:
			</div>
			<div className="flex items-center gap-2">
				<div className="w-[15%]">junk</div>
				<div className="flex-1 h-5 bg-gray-500 rounded-sm"></div>
			</div>
			<div className="flex items-center gap-2">
				<div className="w-[15%]">level 0</div>
				<div className="flex-1 h-5 bg-white rounded-sm"></div>
			</div>
			<div className="flex items-center gap-2">
				<div className="w-[15%]">level 1</div>
				<div className="flex-1 h-5 bg-green-200 rounded-sm"></div>
			</div>
			<div className="flex items-center gap-2">
				<div className="w-[15%]">level 2</div>
				<div className="flex-1 h-5 bg-blue-200 rounded-sm"></div>
			</div>
			<div className="flex items-center gap-2">
				<div className="w-[15%]">level 3</div>
				<div className="flex-1 h-5 bg-purple-200 rounded-sm"></div>
			</div>
			<div className="flex items-center gap-2">
				<div className="w-[15%]">level 4</div>
				<div className="flex-1 h-5 bg-orange-200 rounded-sm"></div>
			</div>
			<div className="flex items-center gap-2">
				<div className="w-[15%]">level 5</div>
				<div className="flex-1 h-5 bg-yellow-200 rounded-sm"></div>
			</div>
			<div className="flex items-center gap-2">
				<div className="w-[15%]">level 6</div>
				<div className="flex-1 h-5 bg-red-200 rounded-sm"></div>
			</div>
			<div className="flex items-center gap-2">
				<div className="w-[15%]">level 7</div>
				<div className="flex-1 h-5 animate-pulse bg-gradient-to-r from-orange-400 via-yellow-400 to-red-400 rounded-sm"></div>
			</div>
			<div className="flex items-center gap-2">
				<div className="w-[15%]">level 8</div>
				<div className="flex-1 h-5 animate-pulse bg-gradient-to-r from-black via-gray-700 to-gray-500 rounded-sm"></div>
			</div>
		</div>
	);

	if (isNil(p)) {
		return <Skeleton className="h-[258px] w-auto"></Skeleton>;
	}

	const cropSize = netWork === "testnet" ? 18 : 26;
	// const pop = "00000001";
	const pop = p.pop.slice(cropSize).slice(0, 8);
	const popArr = pop.split("");
	const reg = /^(?!0)\d+$/; // non zero regex
	const firstNonZeroIndex = popArr.findIndex((v) => v !== "0");
	const level =
		p.pop
			.slice(0, cropSize)
			.split("")
			.findIndex((v) => reg.test(v)) !== -1
			? -1
			: firstNonZeroIndex === -1
			? 8
			: firstNonZeroIndex;
	// const level = firstNonZeroIndex === -1 ? 8 : firstNonZeroIndex;

	return (
		<div
			className={cls(
				"flex flex-col gap-2 border rounded-md p-4 cursor-pointer justify-between",
				{
					"border-[var(--mantine-color-dark-4)]": colorScheme === "dark",
				}
			)}
			onClick={() => router.push(`/dashboard/pin-detail/${p.id}`)}
		>
			<div className="flex items-center justify-between">
				<Text className="text-[26px] text-gray-500" fw={700}>
					{"#" + p.number}
				</Text>

				{isEmpty(p.rootId) ? (
					<Text c="dimmed" size="xs">
						Still In Mempool
					</Text>
				) : (
					<Text c="dimmed" size="xs">
						{p.rootId.slice(0, 4) + "..." + p.rootId.slice(-4)}
					</Text>
				)}
			</div>
			<Divider />
			<div className="flex flex-col gap-2">
				<div className="flex gap-2 ">
					<Text size="sm" c="dimmed">
						operation:
					</Text>
					<Text size="sm" c="dimmed">
						{p.operation}
					</Text>
				</div>
				<div className="flex gap-2">
					<Text size="sm" c="dimmed">
						path:
					</Text>
					<Text size="sm" c="dimmed" className="truncate">
						{p.path.length > 40 ? `${p.path.slice(0, 40)}...` : p.path}
					</Text>
				</div>
				<div className="flex gap-2 items-center">
					<Text size="sm" c="dimmed">
						pop:
					</Text>

					<div
						className={cls(
							"p-1 px-2 rounded-md font-mono flex gap-2 text-[12px] h-6 w-[129.81px]",
							getPopColor(level)
						)}
					>
						{level === -1 ? (
							<div className="w-full text-center">junk</div>
						) : (
							pop.split("").map((n, index) => {
								return (
									<div className="w-full" key={index}>
										{n}
									</div>
								);
							})
						)}
					</div>

					<Tooltip
						label={p.pop}
						classNames={{
							tooltip: "bg-black text-white w-[300px] text-wrap break-all",
						}}
					>
						<ActionIcon variant={"light"} color="gray" size="xs" aria-label="Settings">
							<IconDots style={{ width: "70%", height: "70%" }} stroke={1.2} />
						</ActionIcon>
					</Tooltip>

					<Tooltip
						label={popToolTip}
						classNames={{ tooltip: "bg-black text-white w-[300px] p-2" }}
					>
						<ActionIcon variant={"light"} color="gray" size="xs" aria-label="Settings">
							<IconHelp style={{ width: "70%", height: "70%" }} stroke={1.2} />
						</ActionIcon>
					</Tooltip>
				</div>
			</div>

			<Container
				h={100}
				w={"100%"}
				className={cls("rounded-md grid place-items-center bg-gray-200", {
					"bg-gray-500": colorScheme === "dark",
				})}
			>
				{p.type.includes("image") ? (
					// eslint-disable-next-line @next/next/no-img-element
					<img src={BASE_URL + p.content} alt="content image" width={50} height={50} />
				) : (
					<Text className="break-words break-all">{content}</Text>
				)}
			</Container>
		</div>
	);
};

export default PinCard;

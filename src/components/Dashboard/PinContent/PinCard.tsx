import { Pin } from "@/utils/api";
import React, { useEffect, useState } from "react";
import { Container, Divider, Skeleton, Text, useMantineColorScheme } from "@mantine/core";
import { BASE_URL } from "@/utils/request";
import { count, isEmpty, isNil } from "ramda";
import cls from "classnames";
import { useRouter } from "next/navigation";

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
				return "bg-gray-300";

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
				return "bg-white text-slate-600";
		}
	};

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
	console.log(
		"nonzeroIndex",
		p.pop.split("").findIndex((v) => v !== "0")
	);
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
						{pop.split("").map((n, index) => {
							return (
								<div className="place-self-center w-full" key={index}>
									{level === -1 ? null : n}
								</div>
							);
						})}
					</div>
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

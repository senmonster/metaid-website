import { Pin } from "@/utils/api";
import React from "react";
import { Container, Divider, Skeleton, Text, useMantineColorScheme } from "@mantine/core";
import { BASE_URL } from "@/utils/request";
import { isEmpty, isNil } from "ramda";
import cls from "classnames";
import { useRouter } from "next/navigation";

type Iprops = {
	p?: Pin;
	isLoading?: boolean;
};

const PinCard = ({ p, isLoading = false }: Iprops) => {
	const { colorScheme } = useMantineColorScheme();

	const content = isNil(p)
		? ""
		: p.content.length <= 35
		? p.content
		: p.content.slice(0, 35) + "...";

	const router = useRouter();

	if (isNil(p)) {
		return <Skeleton className="h-[258px] w-auto"></Skeleton>;
	}

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
			</div>

			<Container
				h={120}
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

"use client";

import React, { useState } from "react";
import { Flex, NumberInput, Pagination, ScrollArea, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { metaidService } from "@/utils/api";
// import { useDebouncedValue, usePagination } from "@mantine/hooks";
import { divide, repeat } from "ramda";
import PinCard from "../PinContent/PinCard";
import { useRecoilValue } from "recoil";
import { walletAtom } from "@/store/user";

const MyPinContent = () => {
	const wallet = useRecoilValue(walletAtom);
	// const [size, setSize] = useState<string | number>(18);
	// const [debouncedSize] = useDebouncedValue(size, 800);

	// const { data: CountData } = useQuery({
	// 	queryKey: ["pin", "list", 1],
	// 	queryFn: () => metaidService.getPinList({ page: 1, size: 1 }),
	// });

	// const total = Math.ceil(
	// 	divide(CountData?.Count?.Pin ?? Number(debouncedSize), Number(debouncedSize))
	// );
	// const pagination = usePagination({ total, initialPage: 1 });

	const { data, isError, isLoading } = useQuery({
		queryKey: ["mypin", "list"],
		queryFn: () =>
			metaidService.getPinListByAddress({
				addressType: "owner",
				address: wallet?.address ?? "",
			}),
	});
	return (
		<>
			{isError ? (
				"Server Error"
			) : isLoading ? (
				<ScrollArea className="h-[calc(100vh_-_210px)]" offsetScrollbars>
					<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-6 gap-4 p-2">
						{repeat(1, Number(18)).map((p, index) => {
							return <PinCard key={index} isLoading={true} />;
						})}
					</div>
				</ScrollArea>
			) : (
				<>
					<ScrollArea className="h-[calc(100vh_-_210px)]" offsetScrollbars>
						<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-6 gap-4 p-2">
							{(data ?? []).map((p, index) => {
								return (
									<PinCard
										key={index}
										p={{
											...p,
											type: p.contentType,
											height: 0,
											rootId: p.rootTxId,
											content: p.contentType.includes("image")
												? "/content/" + p.id
												: p.contentSummary,
										}}
									/>
								);
							})}
						</div>
					</ScrollArea>

					{/* <Flex
						className="absolute right-8 bottom-10"
						justify="center"
						align="center"
						direction="row"
						gap="lg"
					>
						<div className="flex gap-2 items-center">
							<Text size="sm" c="dimmed">
								Size Per Page
							</Text>
							<NumberInput
								className="w-[80px]"
								min={1}
								max={CountData?.Count?.Pin ?? Number(debouncedSize)}
								value={size}
								onChange={setSize}
							/>
						</div>
						<Pagination
							total={total}
							value={pagination.active}
							onChange={pagination.setPage}
						/>
					</Flex> */}
				</>
			)}
		</>
	);
};

export default MyPinContent;

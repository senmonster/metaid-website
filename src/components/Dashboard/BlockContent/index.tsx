"use client";

import React, { useState } from "react";
import { Center, Flex, Loader, NumberInput, Pagination, ScrollArea, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { metaidService } from "@/utils/api";
import { useDebouncedValue, usePagination } from "@mantine/hooks";
import { isNil, divide } from "ramda";
import PinCard from "../PinContent/PinCard";

const BlockContent = () => {
	const [size, setSize] = useState<string | number>(18);
	const [debouncedSize] = useDebouncedValue(size, 800);

	const { data: CountData } = useQuery({
		queryKey: ["pin", "list", 1],
		queryFn: () => metaidService.getPinList({ page: 1, size: 1 }),
	});
	const total = Math.ceil(
		divide(CountData?.Count?.Pin ?? Number(debouncedSize), Number(debouncedSize))
	);

	const pagination = usePagination({ total, initialPage: 1 });

	const { data, isError, isLoading } = useQuery({
		queryKey: ["block", "list", pagination.active, Number(debouncedSize)],
		queryFn: () =>
			metaidService.getBlockList({ page: pagination.active, size: Number(debouncedSize) }),
	});

	return (
		<>
			{isError ? (
				"Server error"
			) : isLoading ? (
				<Center className="h-[666px]">
					<Loader type="bars" />
				</Center>
			) : (
				<>
					<ScrollArea className="h-[calc(100vh_-_210px)]" offsetScrollbars>
						<div className="flex flex-col gap-8 p-4">
							{(data?.msgList ?? []).map((blockNumber) => {
								return (
									<div key={blockNumber} className="flex items-center gap-4">
										<div className="font-bold text-2xl">
											{"#" + blockNumber}
										</div>

										<div className="grid grid-cols-1 lg:grid-cols-2  xl:grid-cols-3 2xl:grid-cols-5 flex-1 gap-2">
											{!isNil(data?.msgMap) &&
												data?.msgMap[blockNumber].map((p, index) => {
													return <PinCard p={p} key={index} />;
												})}
										</div>
									</div>
								);
							})}
						</div>
					</ScrollArea>
					<Flex
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
					</Flex>
				</>
			)}
		</>
	);
};

export default BlockContent;

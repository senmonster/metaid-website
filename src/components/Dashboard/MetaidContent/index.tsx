"use client";

import React from "react";
import { isEmpty, isNil, repeat } from "ramda";
import { Avatar, Pagination, ScrollArea, Skeleton, useMantineColorScheme } from "@mantine/core";
import { BASE_URL } from "@/utils/request";
import { useQuery } from "@tanstack/react-query";
import { metaidService } from "@/utils/api";
import { usePagination } from "@mantine/hooks";
import cls from "classnames";
import { useRouter } from "next/navigation";

const MetaidContent = () => {
	const pagination = usePagination({ total: 10, initialPage: 1 });
	const { colorScheme } = useMantineColorScheme();
	const router = useRouter();

	const { data, isError, isLoading } = useQuery({
		queryKey: ["metaidItem", "list", pagination.active],
		queryFn: () => metaidService.getMetaidList({ page: pagination.active, size: 30 }),
	});
	return (
		<>
			{isError ? (
				"Server error"
			) : isLoading ? (
				<ScrollArea className="h-[calc(100vh_-_210px)]" offsetScrollbars>
					<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-6 gap-4 p-2">
						{repeat(1, 30).map((m, idx) => {
							return (
								<Skeleton visible={isLoading} key={idx}>
									<div className="flex gap-2 border rounded-md p-4">
										<Avatar radius="xl" size={"lg"} src={null} />

										<div className="flex flex-col">
											<div>{"mino"}</div>
											<div>{"#12341234"}</div>
										</div>
									</div>
								</Skeleton>
							);
						})}
					</div>
				</ScrollArea>
			) : (
				<>
					<ScrollArea className="h-[calc(100vh_-_210px)]" offsetScrollbars>
						<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-6 gap-4 p-2">
							{(isNil(data) ? [] : data).map((m, index) => {
								return (
									<div
										key={index}
										className={cls(
											"flex gap-2 border rounded-md p-4 cursor-pointer",
											{
												"border-[var(--mantine-color-dark-4)]":
													colorScheme === "dark",
											}
										)}
										onClick={() =>
											router.push(
												`/dashboard/pin-detail/${m.rootTxId + "i0"}`
											)
										}
									>
										<Avatar
											radius="xl"
											size={"lg"}
											src={!isEmpty(m?.avatar) ? BASE_URL + m.avatar : null}
										>
											{m.name.slice(0, 1)}
										</Avatar>
										<div className="flex flex-col">
											<div>
												{isEmpty(m?.name) || isNil(m?.name)
													? `metaid-${m.rootTxId.slice(0, 4)}`
													: m?.name}
											</div>
											<div className="text-[12px] italic text-slate-400">
												{"#" +
													m.rootTxId.slice(0, 4) +
													"..." +
													m.rootTxId.slice(-4)}
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</ScrollArea>
					<Pagination
						className="absolute right-8 bottom-10"
						total={2}
						value={pagination.active}
						onChange={pagination.setPage}
					/>
				</>
			)}
		</>
	);
};

export default MetaidContent;

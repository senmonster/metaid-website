"use client";

import { metaidService } from "@/utils/api";
import { Center, Container, Loader, Text, Image } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import React from "react";
type Iprops = {
	id: string;
};

const PinDetail = ({ id }: Iprops) => {
	const { data, isError, isLoading } = useQuery({
		queryKey: ["pin", "detail", id],
		queryFn: () => metaidService.getPinDetail({ id }),
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
				<div className="flex flex-col gap-4">
					<Text c={"blue"} size={"xl"}>
						{data?.contentTypeDetect}
					</Text>
					{!data?.contentTypeDetect.includes("image") ? (
						<Container
							h={200}
							w={"100%"}
							bg={"var(--mantine-color-blue-light)"}
							className={"rounded-md grid place-items-center"}
						>
							{data?.contentBody ?? ""}{" "}
						</Container>
					) : (
						<Container
							h={200}
							w={"100%"}
							bg={"var(--mantine-color-blue-light)"}
							className={"rounded-md grid place-items-center"}
						>
							<Image
								src={data?.content}
								alt="image"
								h={100}
								w="auto"
								fit="contain"
								fallbackSrc={data?.content}
							/>
						</Container>
					)}
					<div className="flex gap-2 items-center">
						<Text className="text-slate-400 italic">id:</Text>
						<Text>{data?.id}</Text>
					</div>
					<div className="flex gap-2 items-center">
						<Text className="text-slate-400 italic">root txid:</Text>
						<Text>{data?.rootTxId}</Text>
					</div>
					<div className="flex gap-2 items-center">
						<Text className="text-slate-400 italic">address:</Text>
						<Text>{data?.address}</Text>
					</div>
					<div className="flex gap-2 items-center">
						<Text className="text-slate-400 italic">operation:</Text>
						<Text>{data?.operation}</Text>
					</div>
					<div className="flex gap-2 items-center">
						<Text className="text-slate-400 italic">path:</Text>
						<Text>{data?.path}</Text>
					</div>
					<div className="flex gap-2 items-center">
						<Text className="text-slate-400 italic">originalPath:</Text>
						<Text>{data?.originalPath}</Text>
					</div>
					<div className="flex gap-2 items-center">
						<Text className="text-slate-400 italic">version:</Text>
						<Text>{data?.version}</Text>
					</div>
					<div className="flex gap-2 items-center">
						<Text className="text-slate-400 italic">encryption:</Text>
						<Text>{data?.encryption}</Text>
					</div>
					<div className="flex gap-2 items-center">
						<Text className="text-slate-400 italic">output value:</Text>
						<Text>{data?.outputValue}</Text>
					</div>
					<div className="flex gap-2 items-center">
						<Text className="text-slate-400 italic">preview:</Text>
						<Text>{data?.preview}</Text>
					</div>
					<div className="flex gap-2 items-center">
						<Text className="text-slate-400 italic">content:</Text>
						<Text>{data?.content}</Text>
					</div>
					<div className="flex gap-2 items-center">
						<Text className="text-slate-400 italic">content length:</Text>
						<Text>{data?.contentLength}</Text>
					</div>
					<div className="flex gap-2 items-center">
						<Text className="text-slate-400 italic">content type:</Text>
						<Text>{data?.contentType}</Text>
					</div>
					<div className="flex gap-2 items-center">
						<Text className="text-slate-400 italic">timestamp:</Text>
						<Text>{data?.timestamp}</Text>
					</div>
					<div className="flex gap-2 items-center">
						<Text className="text-slate-400 italic">geneis height:</Text>
						<Text>{data?.genesisHeight}</Text>
					</div>
					<div className="flex gap-2 items-center">
						<Text className="text-slate-400 italic">geneis transaction:</Text>
						<Text>{data?.genesisTransaction}</Text>
					</div>
				</div>
			)}
		</>
	);
};

export default PinDetail;

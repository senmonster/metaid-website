"use client";

import MyPinContent from "@/components/Dashboard/MyPinContent";
import { PageContainer } from "@/components/PageContainer/PageContainer";
import { connectedAtom } from "@/store/user";
import { Center } from "@mantine/core";
import { useRecoilValue } from "recoil";

export default function DashboardMyPin() {
	const connected = useRecoilValue(connectedAtom);
	return (
		<PageContainer title="My Personal Information Nodes">
			{connected ? (
				<MyPinContent />
			) : (
				<Center className="h-[60vh]">
					<div className="text-gray-300 text-[36px]">
						Please Connect Your Wallet To Check Your Pin List.
					</div>
				</Center>
			)}
		</PageContainer>
	);
}

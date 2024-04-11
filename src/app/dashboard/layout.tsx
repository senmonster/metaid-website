"use client";

import {
	AppShell,
	Burger,
	Skeleton,
	Text,
	useMantineColorScheme,
	useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Navbar } from "@/components/Navbar/Navbar";
import { navLinks } from "@/config";
// import AdminHeader from '@/components/Headers/AdminHeader';

import dynamic from "next/dynamic";

const AdminHeader = dynamic(() => import("@/components/Headers/AdminHeader"), {
	ssr: false,
	loading: () => (
		<div className="flex justify-between w-full h-[60%] mt-3 mx-2">
			<Skeleton visible={true} className="w-[30%] h-full"></Skeleton>
			<Skeleton visible={true} className="w-[30%] h-full"></Skeleton>
		</div>
	),
});

interface Props {
	children: React.ReactNode;
}

export default function DashboardLayout({ children }: Props) {
	const [opened, { toggle }] = useDisclosure();
	const { colorScheme } = useMantineColorScheme();
	const theme = useMantineTheme();

	const bg = colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[0];

	return (
		<AppShell
			header={{ height: 60 }}
			navbar={{ width: 250, breakpoint: "sm", collapsed: { mobile: !opened } }}
			padding="md"
			transitionDuration={500}
			transitionTimingFunction="ease"
		>
			<AppShell.Navbar>
				<Navbar data={navLinks} hidden={!opened} />
			</AppShell.Navbar>
			<AppShell.Header>
				<AdminHeader
					burger={
						<Burger
							opened={opened}
							onClick={toggle}
							hiddenFrom="sm"
							size="sm"
							mr="xl"
						/>
					}
				/>
			</AppShell.Header>
			<AppShell.Main bg={bg}>{children}</AppShell.Main>
		</AppShell>
	);
}

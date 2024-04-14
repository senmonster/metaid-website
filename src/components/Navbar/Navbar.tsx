"use client";

import { NavLink, ScrollArea } from "@mantine/core";

import { NavItem } from "@/types/nav-item";
import classes from "./Navbar.module.css";
import { usePathname } from "next/navigation";
import cls from "classnames";
import { useRecoilValue } from "recoil";
import { connectedAtom } from "@/store/user";
interface Props {
	data: NavItem[];
	hidden?: boolean;
}

export function Navbar({ data }: Props) {
	const pathname = usePathname();

	const connected = useRecoilValue(connectedAtom);
	const links = data.map((item) => {
		// console.log("connected", connected, "item label", item.label, item.label === "My Pin");

		return (
			// <NavLinksGroup key={item.label} {...item} />
			<NavLink
				className="rounded-md"
				key={item.label}
				href={item.link}
				active={item.link === pathname}
				label={item.label}
				disabled={item.label === "MetaProtocol"}
			/>
		);
	});

	return (
		<>
			<ScrollArea className={classes.links}>
				<div className={cls(classes.linksInner, "flex flex-col gap-2")}>{links}</div>
			</ScrollArea>
		</>
	);
}

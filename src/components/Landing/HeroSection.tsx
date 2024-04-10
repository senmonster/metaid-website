"use client";

import { Button, Container, Group, Text, Title, Image, useMantineColorScheme } from "@mantine/core";
import { IconArrowRight, IconStar } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import classes from "./HeroSection.module.css";
import cls from "classnames";
export function HeroSection() {
	const router = useRouter();
	const { colorScheme } = useMantineColorScheme();

	return (
		<Container pt="sm" size="lg">
			<div className={classes.inner}>
				<Image
					src={colorScheme === "dark" ? "/logo_metaid_bai.png" : "/logo_metaid.png"}
					alt="image"
					w={400}
					h="auto"
				/>
				<Title className={cls(classes.subtitle, { "text-white": colorScheme === "dark" })}>
					Cross-Chain DID Protocol Born for Web3
				</Title>

				<Text className={classes.description} mt={30}>
					MetaID Brings Us Into The Web3 New Era
					<Text>
						Where 7 Billion Users Can Truly Own Their Data And Data Between Apps Can Be
						Interoperable.
					</Text>
				</Text>

				<Group mt={40}>
					<Button
						size="lg"
						className={classes.control}
						onClick={() => {
							router.push("/dashboard");
						}}
						rightSection={<IconArrowRight />}
					>
						Try It Now
					</Button>
					<Button
						variant="outline"
						size="lg"
						className={classes.control}
						onClick={() => {
							// open github
							window.open("https://github.com/orgs/MetaID-Labs/repositories");
						}}
						rightSection={<IconStar />}
					>
						Give a Star
					</Button>
				</Group>
			</div>
		</Container>
	);
}

"use client";

import { ActionIcon, Anchor, Container, Group, Text } from "@mantine/core";
import { IconBook, IconBrandGithub, IconBrandTwitter } from "@tabler/icons-react";
import classes from "./Footer.module.css";

export function Footer() {
	return (
		<div className={classes.footer}>
			<Container className={classes.inner}>
				<Text c="dimmed" fz="sm">
					Build by{" "}
					<Anchor href="https://github.com/orgs/MetaID-Labs/repositories" size="sm">
						MetaID Labs
					</Anchor>
					. Hosted on{" "}
					<Anchor href="https://vercel.com" size="sm">
						Vercel
					</Anchor>
					.
				</Text>
				<Group gap={0} className={classes.links} justify="flex-end" wrap="nowrap">
					<ActionIcon size="lg" color="gray" variant="subtle">
						<IconBrandTwitter size="1.25rem" stroke={1.5} />
					</ActionIcon>
					<ActionIcon size="lg" color="gray" variant="subtle">
						<IconBrandGithub size="1.25rem" stroke={1.5} />
					</ActionIcon>
					<ActionIcon
						size="lg"
						color="gray"
						variant="subtle"
						onClick={() => window.open("https://doc.metaid.io/")}
					>
						<IconBook size="1.25rem" stroke={1.5} />
					</ActionIcon>
				</Group>
			</Container>
		</div>
	);
}

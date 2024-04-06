'use client';

import {
  Container,
  Paper,
  SimpleGrid,
  Space,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import {
  IconBrandMantine,
  IconBrandOauth,
  IconBrandPlanetscale,
} from '@tabler/icons-react';
import classes from './FeatureSection.module.css';

export const featuresData = [
  {
    icon: IconBrandPlanetscale,
    title: 'Multi-Chain Supported',
    description:
      'Centered around Bitcoin, a sidechain/Layer 2 public chain that supports multiple UTXO-based architectures allows user data, even when scattered across multiple chains, to form a unified tree-like structure.',
  },
  {
    icon: IconBrandMantine,
    title: 'Data Interoperability',
    description:
      'Data between different applications/protocols can be interconnected, completely eliminating the information silos between applications/protocols.',
  },
  {
    icon: IconBrandOauth,
    title: 'Fully User Controlled',
    description: `Basic user information and application data are all recorded on the blockchain, stored at addresses controlled by the user's private key. This ensures that the user's application data is independent of the application providers, giving users full control over their own data.
	`,
  },
];

interface FeatureProps {
  icon: React.FC<any>;
  title: React.ReactNode;
  description: React.ReactNode;
}

export function Feature({ icon: Icon, title, description }: FeatureProps) {
  return (
    <Paper h='100%' shadow='md' px='lg' py='sm' radius='md' withBorder>
      <ThemeIcon variant='light' size={60} radius={60}>
        <Icon size='2rem' stroke={1.5} />
      </ThemeIcon>
      <Text mt='sm' mb={7} fw='600'>
        {title}
      </Text>
      <Text size='sm' c='dimmed' style={{ lineHeight: 1.6 }}>
        {description}
      </Text>
    </Paper>
  );
}

interface FeaturesGridProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  data?: FeatureProps[];
}

export function FeaturesSection({
  title,
  description,
  data = featuresData,
}: FeaturesGridProps) {
  const features = data.map((feature, index) => (
    <Feature {...feature} key={index} />
  ));

  return (
    <Container className={classes.wrapper}>
      <Title className={classes.title}>{title}</Title>
      <Space h='md' />

      {/* <Container size={560} p={0}>
        <Text size='sm' className={classes.description}>
          {description}
        </Text>
      </Container> */}

      <SimpleGrid
        mt={60}
        cols={{ base: 1, sm: 2, lg: 3 }}
        spacing={{ base: 'lg', md: 'lg', lg: 'xl' }}
      >
        {features}
      </SimpleGrid>
    </Container>
  );
}

'use client';

import { Button, Container, Group, Text, Title } from '@mantine/core';
import { IconArrowRight, IconStar } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import classes from './HeroSection.module.css';

export function HeroSection() {
  const router = useRouter();

  return (
    <Container pt='sm' size='lg'>
      <div className={classes.inner}>
        <Title className={classes.title}>MetaID</Title>
        <Title className={classes.subtitle}>
          Cross-Chain DID Protocol Born for Web3
        </Title>

        <Text className={classes.description} mt={30}>
          MetaID Brings Us Into The Web3 New Era Where 7 Billion Users Can Truly
          Own Their Data And Data Between Apps Can Be Interoperable.
        </Text>

        <Group mt={40}>
          <Button
            size='lg'
            className={classes.control}
            onClick={() => {
              router.push('/dashboard');
            }}
            rightSection={<IconArrowRight />}
          >
            Try It Now
          </Button>
          <Button
            variant='outline'
            size='lg'
            className={classes.control}
            onClick={() => {
              // open github
              window.open('https://github.com/orgs/MetaID-Labs/repositories');
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

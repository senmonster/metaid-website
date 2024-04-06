'use client';

import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Drawer,
  Stack,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSearch, IconSettings } from '@tabler/icons-react';
import classes from './AdminHeader.module.css';
import { Logo } from '../Logo/Logo';
import ThemModeControl from '../ThemeModeControl';
import { metaidService } from '@/utils/api';
import { useQuery } from '@tanstack/react-query';

interface Props {
  burger?: React.ReactNode;
}

export function AdminHeader({ burger }: Props) {
  const theme = useMantineTheme();
  const { data, isError, isFetching, isLoading } = useQuery({
    queryKey: ['pin', 'list', 1],
    queryFn: () => metaidService.getPinList({ page: 1, size: 18 }),
  });

  return (
    <header className={classes.header}>
      {/* {burger && burger} */}
      <div className='flex items-center gap-2'>
        <Logo />
        <Button variant='light' size='xs' radius='lg'>
          {`total MetaID: ${data?.Count.metaId}` +
            '    |    ' +
            `total Pin: ${data?.Count.Pin}` +
            '    |    ' +
            `total Block: ${data?.Count.block}` +
            '    |    ' +
            `total APP: ${data?.Count.app}`}
        </Button>
      </div>

      {/* <Box style={{ flex: 1 }} /> */}
      <div className='flex gap-2 items-center'>
        <TextInput
          placeholder='Search'
          variant='filled'
          leftSection={<IconSearch size='0.8rem' />}
          style={{}}
        />
        <ThemModeControl />
      </div>
    </header>
  );
}

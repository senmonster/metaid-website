import {
  ActionIcon,
  ActionIconVariant,
  Tooltip,
  useMantineColorScheme,
} from '@mantine/core';
import { IconBrightnessDown, IconMoon } from '@tabler/icons-react';
import React from 'react';

type Iprops = {
  variant?: ActionIconVariant | (string & {}) | undefined;
};

const ThemModeControl = ({ variant = 'subtle' }: Iprops) => {
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  return (
    <>
      {colorScheme === 'light' ? (
        <Tooltip label='Dark Mode'>
          <ActionIcon
            variant={variant}
            color='gray'
            size='lg'
            aria-label='Settings'
          >
            <IconMoon
              style={{ width: '70%', height: '70%' }}
              stroke={1.5}
              onClick={() => setColorScheme('dark')}
            />
          </ActionIcon>
        </Tooltip>
      ) : (
        <Tooltip
          label='Light Mode'
          classNames={{ tooltip: 'bg-white text-black' }}
        >
          <ActionIcon
            variant={variant}
            color='gray'
            size='lg'
            aria-label='Settings'
          >
            <IconBrightnessDown
              style={{ width: '70%', height: '70%' }}
              stroke={1.5}
              onClick={() => setColorScheme('light')}
            />
          </ActionIcon>
        </Tooltip>
      )}
    </>
  );
};

export default ThemModeControl;

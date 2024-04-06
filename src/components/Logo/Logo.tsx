import { Flex, Text } from '@mantine/core';
import Link from 'next/link';
import classes from './Logo.module.css';

interface Props {
  width?: string;
  height?: string;
}

export const Logo: React.FC<Props> = () => {
  return (
    <div>
      <Link
        href='/'
        style={{ textDecoration: 'none' }}
        className={classes.heading}
      >
        <Text fw='bolder' size='xl'>
          Meta
          <Text component='span' fw='normal' className={classes.subheading}>
            ID
          </Text>
        </Text>
      </Link>
    </div>
  );
};

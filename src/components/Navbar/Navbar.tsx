'use client';

import { NavLink, ScrollArea } from '@mantine/core';

import { NavItem } from '@/types/nav-item';
import classes from './Navbar.module.css';
import { usePathname } from 'next/navigation';
import cls from 'classnames';
interface Props {
  data: NavItem[];
  hidden?: boolean;
}

export function Navbar({ data }: Props) {
  const pathname = usePathname();

  const links = data.map((item) => (
    // <NavLinksGroup key={item.label} {...item} />
    <NavLink
      className='rounded-md'
      key={item.label}
      href={item.link}
      active={item.link === pathname}
      label={item.label}
      disabled={item.label === 'MetaProtocol'}
    />
  ));

  return (
    <>
      <ScrollArea className={classes.links}>
        <div className={cls(classes.linksInner, 'flex flex-col gap-2')}>
          {links}
        </div>
      </ScrollArea>
    </>
  );
}

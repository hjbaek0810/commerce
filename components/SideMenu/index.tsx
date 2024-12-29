'use client';

import type { PropsWithChildren } from 'react';

import Link from 'next/link';

import useSideMenu from '@components/SideMenu/useSideMenu';

import * as css from './sideMenu.css';

import type { ParsedUrlQueryInput } from 'querystring';

type SideMenuPropsType = {
  list: Array<SideMenuListType>;
  isHide?: boolean;
};

export type SideMenuListType = {
  title: string;
  href: {
    path: string;
    query?: ParsedUrlQueryInput | string;
  };
  show?: boolean;
  shallow?: boolean;
};

const SideMenu = ({
  list,
  isHide = false,
  children,
}: PropsWithChildren<SideMenuPropsType>) => {
  const { selected } = useSideMenu();

  return (
    <aside data-hide={isHide} className={css.sideMenu}>
      <ul>
        {list.map(item => (
          <li
            key={item.title}
            className={css.sideMenuItemBg({
              selected: selected(item.href.path, item.href.query),
            })}
          >
            <Link
              className={css.sideMenuItem}
              href={{
                pathname: item.href.path,
                query: item.href.query,
              }}
              shallow={item.shallow}
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
      {children}
    </aside>
  );
};

export default SideMenu;

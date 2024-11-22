'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

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
};

const SideMenu = ({ list, isHide }: SideMenuPropsType) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selected = (menuPath: string, query?: ParsedUrlQueryInput | string) => {
    if (!query) {
      return menuPath === pathname;
    }

    const queryParams = new URLSearchParams(query as string);
    const currentFullPath = `${pathname}?${searchParams.toString()}`;
    const menuFullPath = `${pathname}?${queryParams}`;

    return currentFullPath === menuFullPath;
  };

  return (
    <aside data-hide={isHide} className={css.sideMenuWrapper}>
      <ul className={css.sideMenu}>
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
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default SideMenu;

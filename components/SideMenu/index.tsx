'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import * as css from './sideMenu.css';

type SideMenuPropsType = {
  list: Array<ListType>;
};

export type ListType = {
  title: string;
  href: string;
  fullMatch?: boolean;
};

const SideMenu = ({ list }: SideMenuPropsType) => {
  const pathname = usePathname();

  return (
    <aside>
      <ul className={css.sideMenu}>
        {list.map(item => (
          <li
            key={item.title}
            className={css.sideMenuItemBg({
              selected: item.fullMatch
                ? pathname === item.href
                : pathname.startsWith(item.href),
            })}
          >
            <Link className={css.sideMenuItem} href={item.href}>
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default SideMenu;

'use client';

import type { PropsWithChildren } from 'react';

import { usePathname } from 'next/navigation';

import Header from '@components/Header';
import SideMenu from '@components/SideMenu';
import { PATH } from '@utils/path';

import Outlet from './Outlet';
import * as css from './layout.css';

import type { ListType } from '@components/SideMenu';

const HEADER_LIST = [{ path: '', label: 'asd' }];

const SIDE_LIST: Array<ListType> = [
  { title: 'Home', href: '/', fullMatch: true },
];

const Layout = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith(PATH.ADMIN.HOME);
  const homePage = pathname === '/';

  if (isAdminPage) return children;

  return (
    <>
      <Header list={HEADER_LIST} />

      <main className={css.layout}>
        <SideMenu list={SIDE_LIST} />

        {homePage ? children : <Outlet>{children}</Outlet>}
      </main>
    </>
  );
};

export default Layout;

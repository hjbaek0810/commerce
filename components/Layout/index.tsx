'use client';

import Header from '@components/Header';

import SideMenu, { ListType } from '@components/SideMenu';

import { PropsWithChildren } from 'react';
import * as css from './layout.css';
import { usePathname } from 'next/navigation';
import { PATH } from '@utils/path';
import Outlet from './Outlet';

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

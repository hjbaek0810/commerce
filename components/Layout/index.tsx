'use client';

import type { PropsWithChildren } from 'react';

import { usePathname } from 'next/navigation';

import Header from '@components/Header';
import SideMenu from '@components/SideMenu';
import useMenu from '@utils/hooks/useMenu';
import { PATH } from '@utils/path';

import Outlet from './Outlet';
import * as css from './layout.css';

const Layout = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith(PATH.ADMIN.HOME);
  const homePage = pathname === '/';

  if (isAdminPage) return children;

  const { headers, subMenus } = useMenu();

  return (
    <>
      <Header list={headers} />

      <main className={css.layout}>
        <SideMenu list={subMenus} />

        {homePage ? children : <Outlet>{children}</Outlet>}
      </main>
    </>
  );
};

export default Layout;

'use client';

import type { PropsWithChildren } from 'react';

import Header from '@components/Header';
import Outlet from '@components/Layout/Outlet';
import SideMenu from '@components/SideMenu';
import useMenu from '@utils/hooks/useMenu';

import * as css from '../layout.css';

const Wrapper = ({ children }: PropsWithChildren) => {
  const { headers, subMenus, showSideBar } = useMenu();

  return (
    <>
      <Header list={headers} />
      <main className={css.layout}>
        <SideMenu isHide={!showSideBar} list={subMenus} />
        <Outlet fullHeight>{children}</Outlet>
      </main>
    </>
  );
};

export default Wrapper;

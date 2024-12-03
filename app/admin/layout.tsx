import type { PropsWithChildren } from 'react';

import Outlet from '@components/Layout/Outlet';
import SideMenu from '@components/SideMenu';
import { sprinkles } from '@styles/sprinkles.css';
import { PATH } from '@utils/path';

import type { SideMenuListType } from '@components/SideMenu';

const ADMIN_LIST: Array<SideMenuListType> = [
  {
    title: 'Home',
    href: {
      path: PATH.ADMIN.HOME,
    },
  },
  {
    title: 'Categories',
    href: {
      path: PATH.ADMIN.CATEGORY,
    },
  },
  {
    title: 'Products',
    href: {
      path: PATH.ADMIN.PRODUCT.LIST,
    },
  },
];

const AdminLayout = ({ children }: PropsWithChildren) => {
  return (
    <main
      className={sprinkles({
        height: 'sizing-fill',
      })}
    >
      <SideMenu list={ADMIN_LIST} />

      <Outlet fullHeight>{children}</Outlet>
    </main>
  );
};

export default AdminLayout;

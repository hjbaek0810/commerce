import type { PropsWithChildren } from 'react';

import Outlet from '@components/Layout/Outlet';
import AdminSideMenu from '@components/SideMenu/AdminSideMenu';
import { sprinkles } from '@styles/sprinkles.css';

const AdminLayout = ({ children }: PropsWithChildren) => {
  return (
    <main
      className={sprinkles({
        height: 'sizing-fill',
      })}
    >
      <AdminSideMenu />
      <Outlet fullHeight>{children}</Outlet>
    </main>
  );
};

export default AdminLayout;

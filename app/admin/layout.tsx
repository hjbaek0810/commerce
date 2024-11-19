import Outlet from '@components/Layout/Outlet';
import SideMenu, { ListType } from '@components/SideMenu';
import { sprinkles } from '@styles/sprinkles.css';
import { PATH } from '@utils/path';
import { PropsWithChildren } from 'react';

const LIST: Array<ListType> = [
  { title: 'Home', href: PATH.ADMIN.HOME, fullMatch: true },
  { title: 'Categories', href: PATH.ADMIN.CATEGORY },
  { title: 'Products', href: PATH.ADMIN.PRODUCT.LIST },
];

const AdminLayout = ({ children }: PropsWithChildren) => {
  return (
    <main
      className={sprinkles({
        height: 'sizing-fill',
      })}
    >
      <SideMenu list={LIST} />
      <Outlet>{children}</Outlet>
    </main>
  );
};

export default AdminLayout;

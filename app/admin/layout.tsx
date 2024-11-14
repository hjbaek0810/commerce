import SideMenu from '@components/SideMenu';
import { sprinkles } from '@styles/sprinkles.css';
import { PATH } from '@utils/path';

import type { ListType } from '@components/SideMenu';

const AdminLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const LIST: Array<ListType> = [
    { title: 'Home', href: PATH.ADMIN.HOME, fullMatch: true },
    { title: 'Categories', href: PATH.ADMIN.CATEGORY },
    { title: 'Products', href: PATH.ADMIN.PRODUCT.LIST },
  ];

  return (
    <div
      className={sprinkles({
        display: 'flex',
      })}
    >
      <SideMenu list={LIST} />
      <div
        style={{
          paddingLeft: '18.4rem',
        }}
        className={sprinkles({
          display: 'flex',
          flexDirection: 'column',
          paddingRight: 'spacing-024',
          paddingY: 'spacing-032',
          width: 'sizing-fill',
          minHeight: 'sizing-full-screen',
        })}
      >
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;

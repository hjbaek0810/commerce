import type { PropsWithChildren } from 'react';

import AdminSideMenu from '@app/admin/AdminSideMenu';
import Outlet from '@components/Layout/Outlet';
import { sprinkles } from '@styles/sprinkles.css';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard | MiniMall',
  description:
    'Manage products, categories, and users with the admin dashboard.',
  robots: 'noindex, nofollow',
  openGraph: {
    title: 'Admin Dashboard | MiniMall',
    description: 'Access the admin dashboard to manage your MiniMall store.',
    url: `${process.env.NEXT_PUBLIC_VERCEL_URL}/admin`,
    type: 'website',
  },
};

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

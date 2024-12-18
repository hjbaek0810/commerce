'use client';

import { type PropsWithChildren } from 'react';

import { usePathname } from 'next/navigation';

import UserLayout from '@components/Layout/UserLayout';
import { PATH } from '@utils/path';

const Layout = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith(PATH.ADMIN.HOME);

  return isAdmin ? children : <UserLayout>{children}</UserLayout>;
};

export default Layout;

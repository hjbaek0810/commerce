import { type PropsWithChildren } from 'react';

import { headers } from 'next/headers';

import UserLayout from '@components/Layout/UserLayout';
import { PATH } from '@utils/path';

const Layout = ({ children }: PropsWithChildren) => {
  const pathname = headers().get('x-current-path') || '';
  const isAdmin = pathname.startsWith(PATH.ADMIN.HOME);

  return isAdmin ? children : <UserLayout>{children}</UserLayout>;
};

export default Layout;

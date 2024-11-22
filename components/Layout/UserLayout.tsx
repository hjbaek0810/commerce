import type { PropsWithChildren } from 'react';

import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import UserHeader from '@components/Header/UserHeader';
import Outlet from '@components/Layout/Outlet';
import UserSideMenu from '@components/SideMenu/UserSideMenu';
import { fetchData } from '@services/utils/fetch';
import { API } from '@services/utils/path';
import { getQueryClient } from '@utils/query/queryClient';

import * as css from './layout.css';

import type { CategoryVO } from '@api/category/types/vo';

const UserLayout = async ({ children }: PropsWithChildren) => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['categories'],
    queryFn: () => fetchData<Array<CategoryVO>>(API.CATEGORY, 'GET'),
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <UserHeader />
      </HydrationBoundary>
      <main className={css.layout}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <UserSideMenu />
        </HydrationBoundary>

        <Outlet>{children}</Outlet>
      </main>
    </>
  );
};

export default UserLayout;

import type { PropsWithChildren } from 'react';

import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import UserHeader from '@components/Header/UserHeader';
import Outlet from '@components/Layout/Outlet';
import UserSideMenu from '@components/SideMenu/UserSideMenu';
import { getCategoriesQueryOptions } from '@services/queries/category/options';
import { getQueryClient } from '@utils/query/queryClient';

import * as css from './layout.css';

const UserLayout = async ({ children }: PropsWithChildren) => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(getCategoriesQueryOptions());

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <UserHeader />
      </HydrationBoundary>
      <main className={css.layout}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <UserSideMenu />
        </HydrationBoundary>

        <Outlet fullHeight>{children}</Outlet>
      </main>
    </>
  );
};

export default UserLayout;

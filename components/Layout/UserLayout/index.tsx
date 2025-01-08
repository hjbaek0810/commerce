import type { PropsWithChildren } from 'react';

import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import Wrapper from '@components/Layout/UserLayout/Wrapper';
import { getCategoriesQueryOptions } from '@services/queries/category/options';
import { getQueryClient } from '@utils/query/queryClient';

const UserLayout = async ({ children }: PropsWithChildren) => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(getCategoriesQueryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Wrapper>{children}</Wrapper>
    </HydrationBoundary>
  );
};

export default UserLayout;

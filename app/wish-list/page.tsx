import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import { getWishListQueryOptions } from '@services/queries/wish-list/options';
import { getQueryClient } from '@utils/query/queryClient';

import WishGrid from './WishGrid';

const WishList = async () => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(getWishListQueryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <WishGrid />
    </HydrationBoundary>
  );
};

export default WishList;

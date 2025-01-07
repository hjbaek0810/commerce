import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { headers } from 'next/headers';

import { getWishListQueryOptions } from '@services/queries/wish-list/options';
import { getQueryClient } from '@utils/query/queryClient';

import WishGrid from './WishGrid';

import type { Metadata } from 'next/types';

export const metadata: Metadata = {
  title: '찜하기 | MiniMall',
  description: 'MiniMall에서 관심 있는 상품을 찜하고, 나중에 쉽게 확인하세요.',
  robots: 'noindex, nofollow',
};

const WishList = async () => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(getWishListQueryOptions(headers()));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <WishGrid />
    </HydrationBoundary>
  );
};

export default WishList;

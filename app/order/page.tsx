import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { headers } from 'next/headers';

import OrderGrid from '@app/order/OrderGrid';
import { getOrderListInfiniteQueryOptions } from '@services/queries/order/options';
import { getQueryClient } from '@utils/query/queryClient';

import type { Metadata } from 'next/types';

export const metadata: Metadata = {
  title: '주문내역 | MiniMall',
  description: 'MiniMall에서 주문한 상품을 확인하세요.',
  robots: 'noindex, nofollow',
};

const Order = async () => {
  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery(
    getOrderListInfiniteQueryOptions(headers()),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OrderGrid />
    </HydrationBoundary>
  );
};

export default Order;

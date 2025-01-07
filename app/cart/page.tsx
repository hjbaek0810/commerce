import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { headers } from 'next/headers';

import { getCartListQueryOptions } from '@services/queries/cart/options';
import { getQueryClient } from '@utils/query/queryClient';

import CartGrid from './CartGrid';

import type { Metadata } from 'next/types';

export const metadata: Metadata = {
  title: '장바구니 | MiniMall',
  description: 'MiniMall에서 원하는 상품을 쇼핑하고, 장바구니에서 확인하세요.',
  robots: 'noindex, nofollow',
};

const Cart = async () => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(getCartListQueryOptions(headers()));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CartGrid />
    </HydrationBoundary>
  );
};

export default Cart;

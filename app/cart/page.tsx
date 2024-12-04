import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { headers } from 'next/headers';

import { getCartListQueryOptions } from '@services/queries/cart/options';
import { getQueryClient } from '@utils/query/queryClient';

import CartGrid from './CartGrid';

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

import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { headers } from 'next/headers';

import OrderGrid from '@app/order/OrderGrid';
import { getOrderListQueryOptions } from '@services/queries/order/options';
import { getQueryClient } from '@utils/query/queryClient';

const Order = async () => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(getOrderListQueryOptions(headers()));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OrderGrid />
    </HydrationBoundary>
  );
};

export default Order;

import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { headers } from 'next/headers';

import AdminOrderInfo from '@app/admin/order/[slug]/AdminOrderInfo';
import { getAdminOrderDetailQueryOptions } from '@services/queries/order/options';
import { getQueryClient } from '@utils/query/queryClient';

const AdminOrderDetail = async ({ params }: { params: { slug: string } }) => {
  const id = params.slug as string;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(
    getAdminOrderDetailQueryOptions(id, headers()),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminOrderInfo />
    </HydrationBoundary>
  );
};

export default AdminOrderDetail;

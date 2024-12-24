import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { headers } from 'next/headers';

import AdminOrderView from '@app/admin/order/AdminOrderView';
import { getAdminOrderListQueryOptions } from '@services/queries/order/options';
import { getQueryClient } from '@utils/query/queryClient';

const AdminOrderList = async ({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(
    getAdminOrderListQueryOptions({
      searchParams,
      page: Number(searchParams.page) || 1,
      limit: Number(searchParams.limit) || 10,
      headers: headers(),
    }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminOrderView />
    </HydrationBoundary>
  );
};

export default AdminOrderList;

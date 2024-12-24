import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { headers } from 'next/headers';

import AdminProductView from '@app/admin/product/AdminProductView';
import { getAdminCategoriesQueryOptions } from '@services/queries/category/options';
import { getAdminProductListQueryOptions } from '@services/queries/product/options';
import { getQueryClient } from '@utils/query/queryClient';

const AdminProductList = async ({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) => {
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery(
      getAdminProductListQueryOptions({
        searchParams,
        page: Number(searchParams.page) || 1,
        limit: Number(searchParams.limit) || 10,
        headers: headers(),
      }),
    ),
    queryClient.prefetchQuery(getAdminCategoriesQueryOptions(headers())),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminProductView />
    </HydrationBoundary>
  );
};

export default AdminProductList;

import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { headers } from 'next/headers';

import AdminProductInfo from '@app/admin/product/[slug]/AdminProductInfo';
import { getAdminCategoriesQueryOptions } from '@services/queries/category/options';
import { getAdminProductDetailQueryOptions } from '@services/queries/product/options';
import { getQueryClient } from '@utils/query/queryClient';

const AdminProductDetail = async ({ params }: { params: { slug: string } }) => {
  const id = params.slug as string;

  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery(getAdminProductDetailQueryOptions(id, headers())),
    queryClient.prefetchQuery(getAdminCategoriesQueryOptions(headers())),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminProductInfo />
    </HydrationBoundary>
  );
};

export default AdminProductDetail;

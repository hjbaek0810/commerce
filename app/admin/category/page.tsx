import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { headers } from 'next/headers';

import CategoryForm from '@app/admin/category/CategoryForm';
import { getAdminCategoriesQueryOptions } from '@services/queries/category/options';
import { getQueryClient } from '@utils/query/queryClient';

const AdminCategoryForm = async () => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(getAdminCategoriesQueryOptions(headers()));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CategoryForm />
    </HydrationBoundary>
  );
};

export default AdminCategoryForm;

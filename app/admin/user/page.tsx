import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { headers } from 'next/headers';

import AdminUserView from '@app/admin/user/AdminUserView';
import { getAdminUsersQueryOptions } from '@services/queries/user/options';
import { getQueryClient } from '@utils/query/queryClient';

const AdminUserList = async ({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(
    getAdminUsersQueryOptions({
      searchParams,
      page: Number(searchParams.page) || 1,
      limit: Number(searchParams.limit) || 10,
      headers: headers(),
    }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminUserView />
    </HydrationBoundary>
  );
};

export default AdminUserList;

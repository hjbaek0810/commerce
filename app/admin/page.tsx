import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { headers } from 'next/headers';

import AdminUserDashboard from '@app/admin/AdminDashboard/User';
import { getAdminDashboardUsersQueryOptions } from '@services/queries/dashboard/options';
import { getQueryClient } from '@utils/query/queryClient';

const Admin = async ({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(
    getAdminDashboardUsersQueryOptions({
      searchParams,
      headers: headers(),
    }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminUserDashboard />
    </HydrationBoundary>
  );
};

export default Admin;

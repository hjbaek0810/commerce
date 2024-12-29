import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { headers } from 'next/headers';

import AdminOrderDashboard from '@app/admin/AdminDashboard/Order';
import AdminUserDashboard from '@app/admin/AdminDashboard/User';
import {
  getAdminDashboardOrdersQueryOptions,
  getAdminUserDashboardQueryOptions,
} from '@services/queries/dashboard/options';
import { DashboardDateRangeType } from '@utils/constants/dashboard';
import { getQueryClient } from '@utils/query/queryClient';

import * as css from './adminHome.css';

const Admin = async () => {
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery(
      getAdminUserDashboardQueryOptions({
        searchParams: {
          startDate: undefined,
          endDate: undefined,
        },
        headers: headers(),
      }),
    ),
    queryClient.prefetchQuery(
      getAdminDashboardOrdersQueryOptions({
        searchParams: {
          startDate: undefined,
          endDate: undefined,
          dateRangeType: DashboardDateRangeType.MONTHLY,
        },
        headers: headers(),
      }),
    ),
  ]);

  return (
    <div className={css.dashboardWrapper}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <AdminUserDashboard />
      </HydrationBoundary>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <AdminOrderDashboard />
      </HydrationBoundary>
    </div>
  );
};

export default Admin;

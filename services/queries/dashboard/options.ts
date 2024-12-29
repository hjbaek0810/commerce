import { dashboardKeys, dashboardTags } from '@services/queries/dashboard/keys';
import { fetchData } from '@services/utils/fetch';
import { API } from '@services/utils/path';
import { createQueryString } from '@utils/query/helper';

import type {
  SearchAdminOrderDashboard,
  SearchAdminUserDashboard,
} from '@api/admin/dashboard/types/dto';
import type {
  AdminOrderDashboardVO,
  AdminUserDashboardVO,
} from '@api/admin/dashboard/types/vo';

export const getAdminUserDashboardQueryOptions = ({
  searchParams,
  headers,
}: {
  searchParams: SearchAdminUserDashboard;
  headers?: HeadersInit;
}) => ({
  queryKey: dashboardKeys.getUser(searchParams),
  queryFn: () =>
    fetchData<AdminUserDashboardVO>(
      createQueryString(API.ADMIN.DASHBOARD.USER, searchParams),
      'GET',
      { headers, next: { tags: [dashboardTags.all, dashboardTags.user] } },
    ),
});

export const getAdminDashboardOrdersQueryOptions = ({
  searchParams,
  headers,
}: {
  searchParams: SearchAdminOrderDashboard;
  headers?: HeadersInit;
}) => ({
  queryKey: dashboardKeys.getOrder(searchParams),
  queryFn: () =>
    fetchData<AdminOrderDashboardVO>(
      createQueryString(API.ADMIN.DASHBOARD.ORDER, searchParams),
      'GET',
      { headers, next: { tags: [dashboardTags.all, dashboardTags.order] } },
    ),
});

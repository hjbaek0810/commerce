import { dashboardKeys, dashboardTags } from '@services/queries/dashboard/keys';
import { fetchData } from '@services/utils/fetch';
import { API } from '@services/utils/path';
import { createQueryString } from '@utils/query/helper';

import type { SearchUserAdminDashboard } from '@api/admin/dashboard/types/dto';
import type { AdminUserDashboardVO } from '@api/admin/dashboard/types/vo';

export const getAdminDashboardUsersQueryOptions = ({
  searchParams,
  headers,
}: {
  searchParams: SearchUserAdminDashboard;
  headers?: HeadersInit;
}) => ({
  queryKey: dashboardKeys.getUser(searchParams),
  queryFn: () =>
    fetchData<AdminUserDashboardVO[]>(
      createQueryString(API.ADMIN.DASHBOARD.USER, searchParams),
      'GET',
      { headers, next: { tags: [dashboardTags.all, dashboardTags.user] } },
    ),
});

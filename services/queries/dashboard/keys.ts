import type { SearchUserAdminDashboard } from '@api/admin/dashboard/types/dto';

export const dashboardKeys = {
  all: [{ entity: 'dashboard' }] as const,
  getUser: (params: SearchUserAdminDashboard) =>
    [
      {
        ...dashboardKeys.all[0],
        scope: 'user',
        ...params,
      },
    ] as const,
};

export const dashboardTags = {
  all: 'all-dashboard',
  user: 'dashboard-user',
};

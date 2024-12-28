import type {
  SearchAdminOrderDashboard,
  SearchAdminUserDashboard,
} from '@api/admin/dashboard/types/dto';

export const dashboardKeys = {
  all: [{ entity: 'dashboard' }] as const,
  getUser: (params?: SearchAdminUserDashboard) =>
    [
      {
        ...dashboardKeys.all[0],
        scope: 'user',
        ...params,
      },
    ] as const,
  getOrder: (params?: SearchAdminOrderDashboard) =>
    [
      {
        ...dashboardKeys.all[0],
        scope: 'order',
        ...params,
      },
    ] as const,
};

export const dashboardTags = {
  all: 'all-dashboard',
  user: 'dashboard-user',
  order: 'dashboard-order',
};

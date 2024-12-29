import type { DashboardDateRangeType } from '@utils/constants/dashboard';

export type SearchAdminUserDashboard = {
  startDate?: string;
  endDate?: string;
  dateRangeType?: DashboardDateRangeType;
};

export type SearchAdminOrderDashboard = {
  startDate?: string;
  endDate?: string;
  dateRangeType?: DashboardDateRangeType;
};

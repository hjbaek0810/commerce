import type { UserLoginType } from '@utils/constants/user';

export interface AdminUserDashboardVO {
  date: string;
  loginTypes: Record<UserLoginType, { _id: string; name: string }[]>;
}

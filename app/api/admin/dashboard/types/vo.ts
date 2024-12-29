import type { OrderStatus } from '@utils/constants/order';
import type { UserLoginType } from '@utils/constants/user';

export interface AdminUserDashboardVO {
  items: {
    date: string;
    loginTypes: Record<UserLoginType, { _id: string; name: string }[]>;
  }[];
  totalUserCount: number;
}

export interface AdminOrderDashboardVO {
  statusItems: {
    status: OrderStatus;
    count: number;
  }[];
  dateItems: {
    date: string;
    totalPrice: number;
  }[];
}

import type { OrderStatus } from '@utils/constants/order';
import type { UserLoginType } from '@utils/constants/user';

export interface AdminUserDashboardVO {
  date: string;
  loginTypes: Record<UserLoginType, { _id: string; name: string }[]>;
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

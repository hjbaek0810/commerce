import type { OrderSortType, OrderStatus } from '@utils/constants/order';

export type SearchAdminOrder = {
  _id?: string;
  userId?: string;
  username?: string;
  status?: OrderStatus[];
  sort?: OrderSortType;
  startDate?: string;
  endDate?: string;
};

export type UpdateAdminOrder = {
  _id: string;
  status: OrderStatus;
};

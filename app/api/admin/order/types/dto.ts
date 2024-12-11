import type { OrderSortType, OrderStatus } from '@utils/constants/order';

export type SearchAdminOrder = {
  _id?: string;
  userId?: string;
  userName?: string;
  status?: OrderStatus;
  sort?: OrderSortType;
};

import type { SearchAdminOrder } from '@api/admin/order/types/dto';
import type { PaginationQueryParamsType } from '@services/utils/types/pagination';

export const orderKeys = {
  all: [{ entity: 'orders' }] as const,
  getAll: () =>
    [
      {
        ...orderKeys.all[0],
        scope: 'list',
      },
    ] as const,
  getAdminAll: (params?: PaginationQueryParamsType<SearchAdminOrder>) =>
    [
      {
        ...orderKeys.all[0],
        scope: 'admin-list',
        ...params,
      },
    ] as const,
  getAdminDetail: (orderId: string) =>
    [
      {
        ...orderKeys.all[0],
        scope: 'admin-item',
        orderId,
      },
    ] as const,
};

export const orderTags = {
  all: 'all-orders',
  list: 'orders',
  adminList: 'admin-orders',
  adminDetail: (id: string) => `admin-order-${id}`,
};

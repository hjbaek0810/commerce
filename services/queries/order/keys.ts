import type { SearchAdminProduct } from '@api/admin/product/types/dto';
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
  getAdminAll: (params?: PaginationQueryParamsType<SearchAdminProduct>) =>
    [
      {
        ...orderKeys.all[0],
        scope: 'admin-list',
        ...params,
      },
    ] as const,
  getDetail: (orderId: string) =>
    [
      {
        ...orderKeys.all[0],
        scope: 'item',
        orderId,
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
  detail: (id?: string) => `order-${id}`,
  adminDetail: (id?: string) => `admin-order-${id}`,
};

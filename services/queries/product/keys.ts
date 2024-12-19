import type { SearchAdminProduct } from '@api/admin/product/types/dto';
import type { SearchProduct } from '@api/product/types/dto';
import type { PaginationQueryParamsType } from '@services/utils/types/pagination';

export const productKeys = {
  all: [{ entity: 'products' }] as const,
  getAll: (params?: PaginationQueryParamsType<SearchProduct>) =>
    [
      {
        ...productKeys.all[0],
        scope: 'list',
        ...params,
      },
    ] as const,
  getAdminAll: (params?: PaginationQueryParamsType<SearchAdminProduct>) =>
    [
      {
        ...productKeys.all[0],
        scope: 'admin-list',
        ...params,
      },
    ] as const,
  getDetail: (productId: string) =>
    [
      {
        ...productKeys.all[0],
        scope: 'item',
        productId,
      },
    ] as const,
  getAdminDetail: (productId: string) =>
    [
      {
        ...productKeys.all[0],
        scope: 'admin-item',
        productId,
      },
    ] as const,
};

export const productTags = {
  all: 'all-product',
  list: 'products',
  adminList: 'admin-products',
  detail: (id: string) => `product-${id}`,
  adminDetail: (id: string) => `admin-product-${id}`,
};

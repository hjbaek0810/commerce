import type { SearchAdminProduct } from '@api/admin/product/types/dto';
import type { PaginationQueryParamsType } from '@services/utils/types/pagination';

export const wishListKeys = {
  all: [{ entity: 'wish-list' }] as const,
  getAll: () =>
    [
      {
        ...wishListKeys.all[0],
        scope: 'list',
      },
    ] as const,
};

export const wishListTags = {
  all: 'all-wish',
  list: 'wish-list',
};

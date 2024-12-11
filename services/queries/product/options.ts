import { fetchData } from '@services/utils/fetch';
import { API } from '@services/utils/path';
import { createQueryString } from '@utils/query/helper';

import type { ProductDetailVO, ProductVO } from '@api/product/types/vo';
import type { PaginatedResponse } from '@services/utils/types/pagination';

export const PRODUCT_LIST_LIMIT_ITEM = 10;

export const getProductListInfiniteQueryOptions = (
  searchParams: Record<string, string>,
) => ({
  queryKey: [
    'products',
    { scope: 'list' },
    searchParams,
    { categories: ['product', 'order'], action: 'update' },
  ],
  queryFn: ({ pageParam = 1 }) =>
    fetchData<PaginatedResponse<'products', ProductVO>>(
      createQueryString(API.PRODUCT.BASE, {
        ...searchParams,
        page: pageParam,
        limit: PRODUCT_LIST_LIMIT_ITEM,
      }),
      'GET',
    ),
  getNextPageParam: (lastPage: PaginatedResponse<'products', ProductVO>) => {
    const { currentPage, totalCount } = lastPage || {};

    if (currentPage * PRODUCT_LIST_LIMIT_ITEM < totalCount) {
      return lastPage.currentPage + 1;
    }
  },
  initialPageParam: 1,
});

export const getProductTopViewsQueryOptions = () => ({
  queryKey: [
    'products',
    { scope: 'list' },
    { status: 'top-views' },
    { categories: ['product', 'order'], action: 'update' },
  ],
  queryFn: () => fetchData<ProductVO[]>(API.PRODUCT.TOP_VIEWS, 'GET'),
});

export const getProductDetailQueryOptions = (id: string) => ({
  queryKey: [
    'products',
    { scope: 'item', id },
    { categories: ['product', 'order'], action: 'update' },
  ],
  queryFn: () => fetchData<ProductDetailVO>(API.PRODUCT.DETAIL(id), 'GET'),
});

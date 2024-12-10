import { fetchData } from '@services/utils/fetch';
import { API } from '@services/utils/path';
import { createQueryString } from '@utils/query/helper';

import type { OrderListVO } from '@api/order/types/vo';
import type { PaginatedResponse } from '@services/utils/types/pagination';

export const ORDER_LIST_LIMIT_ITEM = 10;

export const getOrderListQueryOptions = (headers?: HeadersInit) => ({
  queryKey: ['order'],
  queryFn: () =>
    fetchData<OrderListVO[]>(API.ORDER.BASE, 'GET', {
      headers,
    }),
});

export const getOrderListInfiniteQueryOptions = (headers?: HeadersInit) => ({
  queryKey: ['order'],
  queryFn: ({ pageParam = 1 }) =>
    fetchData<PaginatedResponse<'orders', OrderListVO>>(
      createQueryString(API.ORDER.BASE, {
        page: pageParam,
        limit: ORDER_LIST_LIMIT_ITEM,
      }),
      'GET',
      { headers },
    ),
  getNextPageParam: (lastPage: PaginatedResponse<'orders', OrderListVO>) => {
    const { currentPage, totalCount } = lastPage;
    if (currentPage * ORDER_LIST_LIMIT_ITEM < totalCount) {
      return lastPage.currentPage + 1;
    }
  },
  initialPageParam: 1,
});

import { orderKeys, orderTags } from '@services/queries/order/keys';
import { fetchData } from '@services/utils/fetch';
import { API } from '@services/utils/path';
import { createQueryString } from '@utils/query/helper';

import type { AdminOrderVO } from '@api/admin/order/types/vo';
import type { OrderVO } from '@api/order/types/vo';
import type { PaginatedResponse } from '@services/utils/types/pagination';

export const ORDER_LIST_LIMIT_ITEM = 4;

export const getOrderListInfiniteQueryOptions = (headers?: HeadersInit) => ({
  queryKey: orderKeys.getAll(),
  queryFn: ({ pageParam = 1 }) =>
    fetchData<PaginatedResponse<'orders', OrderVO>>(
      createQueryString(API.ORDER.BASE, {
        page: pageParam,
        limit: ORDER_LIST_LIMIT_ITEM,
      }),
      'GET',
      {
        headers,
        next: { tags: [orderTags.all, orderTags.list] },
      },
    ),
  getNextPageParam: (lastPage: PaginatedResponse<'orders', OrderVO>) => {
    const { currentPage, totalCount } = lastPage || {};
    if (currentPage * ORDER_LIST_LIMIT_ITEM < totalCount) {
      return lastPage.currentPage + 1;
    }
  },
  initialPageParam: 1,
});

export const getAdminOrderListQueryOptions = ({
  searchParams,
  page,
  limit,
}: {
  searchParams: Record<string, string>;
  page: number;
  limit: number;
}) => ({
  queryKey: orderKeys.getAdminAll({ ...searchParams, page, limit }),
  queryFn: () =>
    fetchData<PaginatedResponse<'orders', AdminOrderVO>>(
      createQueryString(API.ADMIN.ORDER.BASE, {
        ...searchParams,
        page,
        limit,
      }),
      'GET',
      { next: { tags: [orderTags.all, orderTags.adminList] } },
    ),
});

export const getAdminOrderDetailQueryOptions = (id: string) => ({
  queryKey: orderKeys.getAdminDetail(id),
  queryFn: () =>
    fetchData<OrderVO>(API.ADMIN.ORDER.DETAIL(id), 'GET', {
      next: { tags: [orderTags.all, orderTags.adminDetail(id)] },
    }),
});

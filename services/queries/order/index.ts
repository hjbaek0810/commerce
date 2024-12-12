import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

import {
  getAdminOrderDetailQueryOptions,
  getAdminOrderListQueryOptions,
  getOrderListInfiniteQueryOptions,
} from '@services/queries/order/options';
import { fetchData } from '@services/utils/fetch';
import { API } from '@services/utils/path';
import usePaginationQueryParams from '@utils/hooks/usePaginationQueryParams';
import { parseQueryParams } from '@utils/query/helper';

import type { UpdateAdminOrder } from '@api/admin/order/types/dto';
import type { CreateOrder, UpdateOrder } from '@api/order/types/dto';

export const useOrderListInfiniteQuery = () => {
  const { data, ...rest } = useInfiniteQuery(
    getOrderListInfiniteQueryOptions(),
  );

  return {
    ...rest,
    orders: data?.pages.flatMap(page => page.orders) || [],
  };
};

export const useAdminOrderListQuery = () => {
  const searchParams = useSearchParams();
  const queryParams = parseQueryParams(searchParams);
  const { paginationProps, handleSearchParamsChange } =
    usePaginationQueryParams();

  const { data, ...rest } = useQuery({
    ...getAdminOrderListQueryOptions({
      searchParams: queryParams,
      page: paginationProps.currentPage,
      limit: paginationProps.currentLimit,
    }),
    placeholderData: keepPreviousData,
  });

  return {
    ...rest,
    data: data?.orders || [],
    paginationProps: {
      ...paginationProps,
      totalCount: data?.totalCount || 0,
    },
    handleSearchParamsChange,
  };
};

export const useOrderListMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrder) =>
      fetchData<unknown, CreateOrder>(API.ORDER.BASE, 'POST', { data }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [{ categories: ['product', 'order'], action: 'update' }],
        refetchType: 'all',
      });
    },
  });
};

export const useOrderStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateOrder) =>
      fetchData<unknown, UpdateOrder>(API.ORDER.BASE, 'PUT', { data }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['order'],
        refetchType: 'all',
      });
    },
  });
};

export const useAdminOrderDetailQuery = (id: string) =>
  useQuery(getAdminOrderDetailQueryOptions(id));

export const useAdminOrderStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateAdminOrder) =>
      fetchData<unknown, UpdateAdminOrder>(API.ADMIN.ORDER.BASE, 'PUT', {
        data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['order'],
        refetchType: 'all',
      });
    },
  });
};

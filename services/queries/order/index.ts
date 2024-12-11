import { toast } from 'react-toastify';

import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

import {
  getAdminOrderListQueryOptions,
  getOrderListInfiniteQueryOptions,
} from '@services/queries/order/options';
import { fetchData } from '@services/utils/fetch';
import { API } from '@services/utils/path';
import useQueryParams from '@utils/hooks/useQueryParams';
import { parseQueryParams } from '@utils/query/helper';

import type { CreateOrder, UpdateOrder } from '@api/order/types/dto';

export const useOrderListInfiniteQuery = () => {
  const { data, ...rest } = useInfiniteQuery(
    getOrderListInfiniteQueryOptions(),
  );

  const { handleSearchParamsChange } = useQueryParams();

  return {
    ...rest,
    orders: data?.pages.flatMap(page => page.orders) || [],
    handleSearchParamsChange,
  };
};

export const useAdminOrderListQuery = () => {
  const searchParams = useSearchParams();
  const queryParams = parseQueryParams(searchParams);
  const { paginationProps, handleSearchParamsChange } = useQueryParams();

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
        predicate: query =>
          query.queryKey.includes('order') ||
          (query?.queryKey?.[0] as string).startsWith('products') ||
          query.queryKey.includes('cart'),
        refetchType: 'all',
      });
    },
    onError: () => {
      toast.error('잠시 후 시도해주시길 바랍니다.');
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
    onError: () => {
      toast.error('잠시 후 시도해주시길 바랍니다.');
    },
  });
};

import { toast } from 'react-toastify';

import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseInfiniteQuery,
} from '@tanstack/react-query';

import {
  getOrderListInfiniteQueryOptions,
  getOrderListQueryOptions,
} from '@services/queries/order/options';
import { fetchData } from '@services/utils/fetch';
import { API } from '@services/utils/path';

import type { CreateOrder, UpdateOrder } from '@api/order/types/dto';

export const useOrderListQuery = () => useQuery(getOrderListQueryOptions());
export const useOrderListInfiniteQuery = () =>
  useSuspenseInfiniteQuery(getOrderListInfiniteQueryOptions());

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

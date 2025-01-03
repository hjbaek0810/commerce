import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

import { cartKeys } from '@services/queries/cart/keys';
import { orderKeys } from '@services/queries/order/keys';
import {
  getAdminOrderDetailQueryOptions,
  getAdminOrderListQueryOptions,
  getOrderListInfiniteQueryOptions,
} from '@services/queries/order/options';
import { productKeys } from '@services/queries/product/keys';
import { fetchData } from '@services/utils/fetch';
import { invalidateQueries } from '@services/utils/helper';
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
    enabled: !!searchParams,
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
    onSuccess: (_, variables) => {
      const productQueriesToInvalidate = variables.products.flatMap(product => [
        productKeys.getDetail(product._id),
      ]);

      queryClient.invalidateQueries({
        queryKey: orderKeys.getAll(),
      });

      invalidateQueries(
        queryClient,
        [cartKeys.getAll(), ...productQueriesToInvalidate],
        'none',
      );
    },
  });
};

export const useOrderStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateOrder & { productIds: string[] }) =>
      fetchData<unknown, UpdateOrder>(API.ORDER.BASE, 'PUT', { data }),
    onSuccess: (_, variables) => {
      const productQueriesToInvalidate = variables.productIds.flatMap(id => [
        productKeys.getDetail(id),
      ]);
      invalidateQueries(queryClient, [
        orderKeys.getAll(),
        cartKeys.getAll(),
        ...productQueriesToInvalidate,
      ]);
    },
  });
};

export const useAdminOrderDetailQuery = (id: string) =>
  useQuery(getAdminOrderDetailQueryOptions(id));

export const useAdminOrderStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateAdminOrder & { productIds: string[] }) =>
      fetchData<unknown, UpdateAdminOrder>(API.ADMIN.ORDER.BASE, 'PUT', {
        data,
      }),
    onSuccess: (_, variables) => {
      const productQueriesToInvalidate = variables.productIds.flatMap(id => [
        productKeys.getAdminDetail(id),
      ]);

      invalidateQueries(queryClient, [
        orderKeys.getAdminDetail(variables._id),
        cartKeys.getAll(),
        ...productQueriesToInvalidate,
      ]);
    },
  });
};

import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

import { OrderVO } from '@api/order/types/vo';
import { cartKeys, cartTags } from '@services/queries/cart/keys';
import { orderKeys, orderTags } from '@services/queries/order/keys';
import {
  getAdminOrderDetailQueryOptions,
  getAdminOrderListQueryOptions,
  getOrderListInfiniteQueryOptions,
} from '@services/queries/order/options';
import { productKeys, productTags } from '@services/queries/product/keys';
import { fetchData } from '@services/utils/fetch';
import {
  invalidateQueries,
  resetQueries,
  revalidateTags,
} from '@services/utils/helper';
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
    onSuccess: async (_, variables) => {
      const productTagsToRevalidate = variables.products.flatMap(item => [
        productTags.detail(item._id),
        productTags.adminDetail(item._id),
      ]);

      await Promise.all([
        revalidateTags([
          ...productTagsToRevalidate,
          productTags.list,
          cartTags.list,
          orderTags.adminList,
        ]),
        queryClient.invalidateQueries({
          queryKey: orderKeys.getAll(),
          refetchType: 'all',
        }),
      ]);
    },
  });
};

export const useOrderStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateOrder & { productIds: string[] }) =>
      fetchData<unknown, UpdateOrder>(API.ORDER.BASE, 'PUT', { data }),
    onSuccess: async (_, variables) => {
      const productTagsToRevalidate = variables.productIds.flatMap(id => [
        productTags.detail(id),
        productTags.adminDetail(id),
      ]);

      const productQueriesToInvalidate = variables.productIds.flatMap(id => [
        productKeys.getDetail(id),
        productKeys.getAdminDetail(id),
      ]);

      await Promise.all([
        revalidateTags([
          ...productTagsToRevalidate,
          productTags.list,
          productTags.adminList,
          cartTags.list,
          orderTags.adminList,
          orderTags.adminDetail(variables._id),
        ]),
        invalidateQueries(queryClient, [orderKeys.getAll()]),
        resetQueries(queryClient, [
          ...productQueriesToInvalidate,
          cartKeys.getAll(),
          orderKeys.getAdminAll(),
        ]),
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
    onSuccess: async (_, variables) => {
      const productTagsToRevalidate = variables.productIds.flatMap(id => [
        productTags.detail(id),
        productTags.adminDetail(id),
      ]);

      const productQueriesToInvalidate = variables.productIds.flatMap(id => [
        productKeys.getDetail(id),
        productKeys.getAdminDetail(id),
      ]);

      await Promise.all([
        revalidateTags([
          ...productTagsToRevalidate,
          productTags.list,
          productTags.adminList,
          cartTags.list,
          orderTags.list,
          orderTags.detail(variables._id),
        ]),
        invalidateQueries(queryClient, [
          orderKeys.getAdminDetail(variables._id),
        ]),
        resetQueries(queryClient, [
          ...productQueriesToInvalidate,
          orderKeys.getAll(),
          orderKeys.getAdminAll(),
          orderKeys.getDetail(variables._id),
          cartKeys.getAll(),
        ]),
      ]);
    },
  });
};

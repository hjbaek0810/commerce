import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { cartKeys } from '@services/queries/cart/keys';
import { getCartListQueryOptions } from '@services/queries/cart/options';
import { fetchData } from '@services/utils/fetch';
import { API } from '@services/utils/path';

import type { DeleteCartItems, UpdateCartItem } from '@api/cart/types/dto';
import type { CartListVO } from '@api/cart/types/vo';

export const useCartListQuery = () =>
  useQuery({
    ...getCartListQueryOptions(),
    select: (data: CartListVO) => ({ ...data, items: data.items }),
  });

export const useCartListWhenNewOrderQuery = (
  selectedProductIds: string[],
  fromCart: boolean,
) =>
  useQuery({
    ...getCartListQueryOptions(),
    select: data => {
      const filteredItems = data.items.filter(item =>
        selectedProductIds.includes(item.product._id),
      );

      return {
        _id: data._id,
        items: filteredItems || [],
      };
    },
    enabled: fromCart,
  });

export const useCartListMutation = (shouldRefetch?: boolean) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCartItem) =>
      fetchData<unknown, UpdateCartItem>(API.CART.BASE, 'POST', { data }),
    onMutate: () => {},
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: cartKeys.getAll(),
        refetchType: shouldRefetch ? 'all' : 'none',
      });
    },
  });
};

export const useDeleteCartListMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DeleteCartItems) =>
      fetchData<CartListVO, DeleteCartItems>(API.CART.BASE, 'DELETE', {
        data,
      }),
    onMutate: () => {},
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: cartKeys.getAll(),
        refetchType: 'none',
      });
    },
  });
};

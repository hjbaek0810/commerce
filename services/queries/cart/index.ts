import { toast } from 'react-toastify';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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

export const useCartListMutation = () => {
  return useMutation({
    mutationFn: (data: UpdateCartItem) =>
      fetchData<unknown, UpdateCartItem>(API.CART.BASE, 'POST', { data }),

    onMutate: () => {},
  });
};

export const useDeleteCartListMutation = () => {
  return useMutation({
    mutationFn: (data: DeleteCartItems) =>
      fetchData<CartListVO, DeleteCartItems>(API.CART.BASE, 'DELETE', {
        data,
      }),
    onMutate: () => {},
  });
};

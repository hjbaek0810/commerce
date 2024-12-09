import { toast } from 'react-toastify';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getCartListQueryOptions } from '@services/queries/cart/options';
import { fetchData } from '@services/utils/fetch';
import { API } from '@services/utils/path';

import type { DeleteCartItems, UpdateCartItem } from '@api/cart/types/dto';
import type { CartListVO } from '@api/cart/types/vo';

export const useCartListQuery = () => useQuery(getCartListQueryOptions());

export const useCartListMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCartItem) =>
      fetchData<unknown, UpdateCartItem>(API.CART.BASE, 'POST', { data }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['cart'],
        refetchType: 'all',
      });
    },
    onError: () => {
      toast.error('잠시 후 시도해주시길 바랍니다.');
    },
    onMutate: () => {},
  });
};

export const useDeleteCartListMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DeleteCartItems) =>
      fetchData<CartListVO, DeleteCartItems>(API.CART.BASE, 'DELETE', {
        data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['cart'],
        refetchType: 'all',
      });
    },
    onError: () => {
      toast.error('잠시 후 시도해주시길 바랍니다.');
    },
    onMutate: () => {},
  });
};

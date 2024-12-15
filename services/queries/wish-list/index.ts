import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { wishListKeys } from '@services/queries/wish-list/keys';
import { getWishListQueryOptions } from '@services/queries/wish-list/options';
import { fetchData } from '@services/utils/fetch';
import { API } from '@services/utils/path';

import type { DeleteWishItem, UpdateWishItem } from '@api/wish-list/types/dto';
import type { WishListVO } from '@api/wish-list/types/vo';

export const useWishListQuery = () => useQuery(getWishListQueryOptions());

export const useWishListMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateWishItem) =>
      fetchData<unknown, UpdateWishItem>(API.WISH_LIST.BASE, 'POST', { data }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: wishListKeys.getAll(),
        refetchType: 'none',
      });
    },
    onMutate: () => {},
  });
};

export const useDeleteWishListMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DeleteWishItem) =>
      fetchData<WishListVO, DeleteWishItem>(API.WISH_LIST.BASE, 'DELETE', {
        data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: wishListKeys.getAll(),
        refetchType: 'none',
      });
    },
  });
};

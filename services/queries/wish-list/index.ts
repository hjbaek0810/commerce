import { toast } from 'react-toastify';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getWishListQueryOptions } from '@services/queries/wish-list/options';
import { fetchData } from '@services/utils/fetch';
import { API } from '@services/utils/path';

import type { UpdateWishItem } from '@api/wish-list/types/dto';

export const useWishListQuery = () => useQuery(getWishListQueryOptions());

export const useWishListMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateWishItem) =>
      fetchData<unknown, UpdateWishItem>(API.WISH_LIST.BASE, 'POST', { data }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['wish-list'],
        refetchType: 'all',
      });
    },
    onError: () => {
      toast.error('잠시 후 시도해주시길 바랍니다.');
    },
    onMutate: () => {},
  });
};

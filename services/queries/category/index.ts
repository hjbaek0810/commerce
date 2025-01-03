import { toast } from 'react-toastify';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { CategoryErrorException } from '@api/exception';
import { categoryKeys } from '@services/queries/category/keys';
import {
  getAdminCategoriesQueryOptions,
  getCategoriesQueryOptions,
} from '@services/queries/category/options';
import { isApiError } from '@services/utils/error';
import { fetchData } from '@services/utils/fetch';
import { API } from '@services/utils/path';

import type { AdminCreateCategory } from '@api/admin/category/types/dto';
import type { CategoryVO } from '@api/category/types/vo';

export const useCategoriesQuery = () => {
  const { data, ...rest } = useQuery({
    ...getCategoriesQueryOptions(),
    refetchOnMount: false,
  });

  return {
    ...rest,
    data: data || [],
  };
};

export const useAdminCategoriesQuery = () => {
  const { data, ...rest } = useQuery({
    ...getAdminCategoriesQueryOptions(),
    refetchOnMount: false,
  });

  return {
    ...rest,
    data: data || [],
  };
};

export const useAdminCategoriesMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categories: AdminCreateCategory[]) =>
      fetchData<Array<CategoryVO>, AdminCreateCategory[]>(
        API.ADMIN.CATEGORY,
        'PUT',
        {
          data: categories.map(category => ({
            ...category,
            subCategories: category.subCategories?.filter(
              sub => sub.name?.length > 0,
            ),
          })),
        },
      ),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: categoryKeys.all,
      }),
    onError: error => {
      if (isApiError(error)) {
        if (error.code === CategoryErrorException.REFERENCED_BY_PRODUCT.code) {
          toast.error(
            '삭제하려는 카테고리 중 일부가 등록된 상품에 포함되어 있어 삭제할 수 없습니다. 관련 상품을 먼저 수정하거나 삭제해주세요.',
          );

          return;
        }
      }

      toast.error(
        '카테고리 업데이트에 실패했습니다. 잠시 후 시도해주시길 바랍니다.',
      );
    },
  });
};

'use client';

import type { MouseEvent } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { isEmpty } from 'lodash-es';
import { useRouter, useSearchParams } from 'next/navigation';

import {
  useDeleteWishListMutation,
  useWishListQuery,
} from '@services/queries/wish-list';
import { wishListKeys } from '@services/queries/wish-list/keys';
import { PATH } from '@utils/path';

import type { WishListVO } from '@api/wish-list/types/vo';

const useWishGrid = () => {
  const queryClient = useQueryClient();
  const { data } = useWishListQuery();
  const { mutate: deleteWishItem } = useDeleteWishListMutation();

  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const subCategoryParam = searchParams.get('subCategory');

  const router = useRouter();

  const handleDeleteWishButtonClick = (productId: string, e: MouseEvent) => {
    e.preventDefault();

    deleteWishItem(
      { productId },
      {
        onSuccess: () => {
          queryClient.setQueryData<WishListVO>(
            wishListKeys.getAll(),
            previous => {
              if (!previous) return data;

              const updatedItems = previous?.items.filter(
                item => item._id !== productId,
              );

              return {
                ...previous,
                items: updatedItems,
              };
            },
          );
        },
      },
    );
  };

  const handleGoToProductButtonClick = () => router.push(PATH.PRODUCT.LIST);

  return {
    isEmptyWishList: data?.items && isEmpty(data?.items),
    wishList: data?.items || [],
    productDetailQuery: {
      categoryParam,
      subCategoryParam,
    },
    handleDeleteWishButtonClick,
    handleGoToProductButtonClick,
  };
};

export default useWishGrid;

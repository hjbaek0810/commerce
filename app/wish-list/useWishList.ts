'use client';

import type { MouseEvent } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import {
  useDeleteWishListMutation,
  useWishListQuery,
} from '@services/queries/wish-list';
import { PATH } from '@utils/path';

const useWishList = () => {
  const { data } = useWishListQuery();
  const { mutate: deleteWishItem } = useDeleteWishListMutation();

  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const subCategoryParam = searchParams.get('subCategory');

  const router = useRouter();

  const handleDeleteWishButtonClick = (productId: string, e: MouseEvent) => {
    e.preventDefault();

    deleteWishItem({ productId });
  };

  const handleGoToProductButtonClick = () => router.push(PATH.PRODUCT.LIST);

  return {
    wishList: data?.items || [],
    productDetailQuery: {
      categoryParam,
      subCategoryParam,
    },
    handleDeleteWishButtonClick,
    handleGoToProductButtonClick,
  };
};

export default useWishList;

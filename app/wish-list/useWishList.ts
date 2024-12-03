'use client';

import type { MouseEvent } from 'react';

import { useSearchParams } from 'next/navigation';

import {
  useDeleteWishListMutation,
  useWishListQuery,
} from '@services/queries/wish-list';

const useWishList = () => {
  const { data } = useWishListQuery();
  const { mutate: deleteWishItem } = useDeleteWishListMutation();

  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const subCategoryParam = searchParams.get('subCategory');

  const handleDeleteWishButtonClick = (productId: string, e: MouseEvent) => {
    e.preventDefault();

    deleteWishItem({ productId });
  };

  return {
    wishList: data?.items || [],
    productDetailQuery: {
      categoryParam,
      subCategoryParam,
    },
    handleDeleteWishButtonClick,
  };
};

export default useWishList;

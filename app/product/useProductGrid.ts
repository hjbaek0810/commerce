import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { useSearchParams } from 'next/navigation';

import { useProductListInfiniteQuery } from '@services/queries/product';
import { ProductSortType, ProductStatusType } from '@utils/constants/product';
import useDebounce from '@utils/hooks/useDebounce';
import useIntersectionObserver from '@utils/hooks/useIntersectionObserver';

import type { SearchProduct } from '@api/product/types/dto';

const useProductGrid = () => {
  const {
    products,
    changeSearchParams,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProductListInfiniteQuery();

  const { setTarget } = useIntersectionObserver({
    hasNextPage,
    fetchNextPage,
  });

  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const subCategoryParam = searchParams.get('subCategory');

  const productsUseForm = useForm<SearchProduct>({
    values: {
      name: searchParams.get('name') || '',
      sort:
        (searchParams.get('sort') as ProductSortType) || ProductSortType.NEWEST,
    },
  });
  const { control, getValues } = productsUseForm;

  const keyword = useWatch({
    name: 'name',
    control,
    defaultValue: searchParams.get('name') || '',
  });

  const debouncedKeyword = useDebounce<string>(keyword ?? '', 400);

  useEffect(() => {
    if (keyword === debouncedKeyword)
      changeSearchParams({ name: debouncedKeyword });
  }, [debouncedKeyword, changeSearchParams, keyword]);

  const handleSortChange = () => {
    const sort = getValues('sort');

    changeSearchParams({ sort });
  };

  const isSoldOut = (status: ProductStatusType) =>
    status === ProductStatusType.STOPPED;

  return {
    keyword,
    products,
    productsUseForm,
    handleSortChange,
    productDetailQuery: {
      categoryParam,
      subCategoryParam,
    },
    isSoldOut,
    setTarget,
    isFetchingNextPage,
  };
};

export default useProductGrid;

import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { isEmpty } from 'lodash-es';
import { useRouter, useSearchParams } from 'next/navigation';

import { useAdminProductListWithCategoryQueries } from '@services/queries/product';
import { ProductSortType } from '@utils/constants/product';
import { PATH } from '@utils/path';

import type { AdminSubCategoryVO } from '@api/admin/category/types/vo';
import type { SearchAdminProduct } from '@api/admin/product/types/dto';
import type { ProductStatusType } from '@utils/constants/product';

const useAdminProductList = () => {
  const router = useRouter();

  const { products, categories, handleSearchParamsChange } =
    useAdminProductListWithCategoryQueries();

  const searchParams = useSearchParams();

  const searchAdminProductForm = useForm<SearchAdminProduct>({
    values: {
      category: searchParams.get('category') || '',
      subCategory: searchParams.get('subCategory') || '',
      name: searchParams.get('name') || '',
      status: (searchParams.get('status') as ProductStatusType) || '',
      sort:
        (searchParams.get('sort') as ProductSortType) || ProductSortType.NEWEST,
    },
  });
  const { control, reset, setValue, getValues } = searchAdminProductForm;

  const [subCategories, setSubCategories] = useState<
    Array<Omit<AdminSubCategoryVO, 'deletable'>>
  >([]);

  const selectedCategoryId = useWatch({
    name: 'category',
    control,
    defaultValue: '',
  });

  useEffect(() => {
    if (!categories.data) return;

    if (!selectedCategoryId && !isEmpty(subCategories)) {
      setValue('subCategory', '');
      setSubCategories([]);

      return;
    }

    if (!selectedCategoryId) return;

    const category = categories.data.find(
      category => category._id === selectedCategoryId,
    );

    if (!category?.subCategories.length) {
      setValue('subCategory', '');
    }

    setSubCategories(category?.subCategories ?? []);
  }, [selectedCategoryId, categories, setValue, subCategories]);

  const handleTableRowClick = (id: string) => {
    router.push(PATH.ADMIN.PRODUCT.DETAIL(id));
  };

  const handleAdminSearchProduct = (data: SearchAdminProduct) => {
    handleSearchParamsChange(data);
  };

  const handleFilterResetButtonClick = () => {
    reset();

    handleSearchParamsChange({
      category: '',
      subCategory: '',
      name: '',
      status: '',
      sort: ProductSortType.NEWEST,
    });
  };

  const handleGoToProductRegisterButtonClick = () =>
    router.push(PATH.ADMIN.PRODUCT.REGISTER);

  const handleSortChange = () => {
    const sort = getValues('sort');

    handleSearchParamsChange({ sort });
  };

  return {
    categories: categories.data,
    subCategories,
    products: products.data,
    paginationProps: products.paginationProps,
    searchAdminProductForm,
    handleTableRowClick,
    handleAdminSearchProduct,
    handleFilterResetButtonClick,
    handleGoToProductRegisterButtonClick,
    handleSortChange,
  };
};

export default useAdminProductList;

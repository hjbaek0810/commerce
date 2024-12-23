import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { useQueryClient } from '@tanstack/react-query';
import { isEmpty, isEqual } from 'lodash-es';
import { useRouter, useSearchParams } from 'next/navigation';

import {
  useAdminProductListWithCategoryQueries,
  useAdminProductMultiDeleteMutation,
} from '@services/queries/product';
import { productKeys } from '@services/queries/product/keys';
import { ProductSortType } from '@utils/constants/product';
import { PATH } from '@utils/path';

import type { AdminSubCategoryVO } from '@api/admin/category/types/vo';
import type {
  DeleteAdminProducts,
  SearchAdminProduct,
} from '@api/admin/product/types/dto';
import type { ProductStatusType } from '@utils/constants/product';

type AdminDeleteProductUseFormType = {
  productIds: string[];
};

const useAdminProductList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { products, categories, handleSearchParamsChange } =
    useAdminProductListWithCategoryQueries();
  const { mutate: deleteProducts } = useAdminProductMultiDeleteMutation();

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

  const deleteProductForm = useForm<AdminDeleteProductUseFormType>();

  const [subCategories, setSubCategories] = useState<
    Array<Omit<AdminSubCategoryVO, 'deletable'>>
  >([]);

  const [requestDeleteProducts, setRequestDeleteProducts] =
    useState<DeleteAdminProducts>([]);

  const selectedCategoryId = useWatch({
    name: 'category',
    control,
    defaultValue: '',
  });

  const selectedDeleteProductIds = useWatch({
    name: 'productIds',
    control: deleteProductForm.control,
    defaultValue: [],
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

  useEffect(() => {
    if (!products.data || !selectedDeleteProductIds) return;

    if (
      isEqual(
        requestDeleteProducts.map(item => item._id),
        selectedDeleteProductIds,
      )
    )
      return;

    setRequestDeleteProducts(prevRequestDeleteProducts => {
      const updatedDeleteProducts = selectedDeleteProductIds.map(productId => {
        const product = products.data.find(p => p._id === productId);

        return {
          _id: productId,
          deleteImageIds: product
            ? product.images?.map(({ publicId }) => publicId)
            : [],
        };
      });

      const filteredDeleteProducts = prevRequestDeleteProducts.filter(item =>
        selectedDeleteProductIds.includes(item._id),
      );

      const newRequestDeleteProducts = [
        ...filteredDeleteProducts,
        ...updatedDeleteProducts.filter(
          updatedProduct =>
            !filteredDeleteProducts.some(
              prevProduct => prevProduct._id === updatedProduct._id,
            ),
        ),
      ];

      return newRequestDeleteProducts;
    });
  }, [selectedDeleteProductIds, products, requestDeleteProducts]);

  const handleTableRowClick = (id: string) => {
    router.push(PATH.ADMIN.PRODUCT.DETAIL(id));
  };

  const handleAdminSearchProduct = (data: SearchAdminProduct) => {
    deleteProductForm.reset();
    handleSearchParamsChange(data);
  };

  const handleFilterResetButtonClick = () => {
    reset();
    deleteProductForm.reset();

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
    deleteProductForm.reset();
  };

  const handleRemoveProduct = () => {
    if (isEmpty(requestDeleteProducts)) return;

    deleteProducts(requestDeleteProducts);
  };

  return {
    categories: categories.data,
    subCategories,
    products: products.data,
    paginationProps: products.paginationProps,
    searchAdminProductForm,
    deleteProductForm,
    handleTableRowClick,
    handleAdminSearchProduct,
    handleFilterResetButtonClick,
    handleGoToProductRegisterButtonClick,
    handleSortChange,
    handleRemoveProduct,
  };
};

export default useAdminProductList;

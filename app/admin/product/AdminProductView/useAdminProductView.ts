import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { isEmpty, isEqual } from 'lodash-es';
import { useRouter, useSearchParams } from 'next/navigation';

import {
  useAdminProductListWithCategoryQueries,
  useAdminProductMultiDeleteMutation,
} from '@services/queries/product';
import { ProductSortType, ProductStatusType } from '@utils/constants/product';
import { PATH } from '@utils/path';

import type { AdminSubCategoryVO } from '@api/admin/category/types/vo';
import type {
  DeleteAdminProducts,
  SearchAdminProduct,
} from '@api/admin/product/types/dto';

export type AdminDeleteProductUseFormType = {
  productIds: string[];
};

const INITIAL_STATUS_VALUES = [
  ProductStatusType.IN_PROGRESS,
  ProductStatusType.HIDDEN,
  ProductStatusType.STOPPED,
];

const useAdminProductView = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { products, categories, handleSearchParamsChange } =
    useAdminProductListWithCategoryQueries();

  const [subCategories, setSubCategories] = useState<
    Array<Omit<AdminSubCategoryVO, 'deletable'>>
  >([]);

  const defaultStatusValue = searchParams.get('status')
    ? (searchParams.get('status')?.split(',') as ProductStatusType[])
    : INITIAL_STATUS_VALUES;

  const defaultCategoryValue = searchParams.get('category') || '';

  const defaultSubCategoryValue = searchParams.get('subCategory')
    ? searchParams.get('subCategory')?.split(',')
    : [];

  const searchAdminProductForm = useForm<SearchAdminProduct>({
    values: {
      category: defaultCategoryValue,
      subCategory: defaultSubCategoryValue,
      name: searchParams.get('name') || '',
      status: defaultStatusValue,
      sort:
        (searchParams.get('sort') as ProductSortType) || ProductSortType.NEWEST,
    },
  });

  const { control, reset, setValue, getValues } = searchAdminProductForm;

  const selectedCategoryId = useWatch({
    name: 'category',
    control,
    defaultValue: defaultCategoryValue,
  });

  const selectedSubCategories = useWatch({
    name: 'subCategory',
    control,
    defaultValue: defaultSubCategoryValue,
  });

  const selectedStatus = useWatch({
    name: 'status',
    control,
    defaultValue: defaultStatusValue,
  });

  const { mutate: deleteProducts } = useAdminProductMultiDeleteMutation();

  const deleteProductForm = useForm<AdminDeleteProductUseFormType>();

  const [requestDeleteProducts, setRequestDeleteProducts] =
    useState<DeleteAdminProducts>([]);

  const selectedDeleteProductIds = useWatch({
    name: 'productIds',
    control: deleteProductForm.control,
    defaultValue: [],
  });

  useEffect(() => {
    if (!selectedStatus || isEmpty(selectedStatus)) {
      setValue('status', INITIAL_STATUS_VALUES);
    }
  }, [selectedStatus, setValue]);

  useEffect(() => {
    if (subCategories.length > 0 && isEmpty(selectedSubCategories)) {
      setValue(
        'subCategory',
        subCategories.map(sub => sub._id),
      );
    }
  }, [selectedSubCategories, setValue, subCategories]);

  useEffect(() => {
    if (!categories.data) return;

    const resetSubCategories = () => {
      setSubCategories([]);
      setValue('subCategory', []);
    };

    // all click
    if (!selectedCategoryId) {
      if (!isEmpty(subCategories)) {
        resetSubCategories();
      }

      return;
    }

    const category = categories.data.find(
      category => category._id === selectedCategoryId,
    );

    // 선택한 카테고리에 서브카테고리가 없는 경우
    if (isEmpty(category?.subCategories)) {
      if (!isEmpty(subCategories)) {
        resetSubCategories();
      }

      return;
    }

    // 선택한 카테고리에 서브카테고리가 있는 경우
    if (
      category?.subCategories &&
      !isEqual(category.subCategories, subCategories)
    ) {
      const subCategoryIds = category.subCategories.map(item => item._id);
      setSubCategories(category.subCategories);
      setValue('subCategory', subCategoryIds);
    }
  }, [categories.data, selectedCategoryId, setValue, subCategories]);

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

  const handleChangeCategory = () => {
    setValue('subCategory', []);
  };

  const handleAdminSearchProduct = (data: SearchAdminProduct) => {
    deleteProductForm.reset();

    const { subCategory: checkedSubCategories, status, ...restData } = data;

    const isSearchSubCategory =
      subCategories.length !== 0 &&
      checkedSubCategories?.length !== subCategories.length;

    const isSearchStatus =
      status && status.length !== INITIAL_STATUS_VALUES.length;

    handleSearchParamsChange({
      subCategory: isSearchSubCategory ? checkedSubCategories : '',
      status: isSearchStatus ? status : '',
      ...restData,
    });
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

  const handleSortChange = () => {
    const sort = getValues('sort');

    handleSearchParamsChange({ sort });
    deleteProductForm.reset();
  };

  const handleGoToProductRegisterButtonClick = () =>
    router.push(PATH.ADMIN.PRODUCT.REGISTER);

  const handleTableRowClick = (id: string) => {
    router.push(PATH.ADMIN.PRODUCT.DETAIL(id));
  };

  const handleRemoveProduct = () => {
    if (isEmpty(requestDeleteProducts)) return;

    deleteProducts(requestDeleteProducts);
  };

  return {
    searchFilterProps: {
      categories: categories.data,
      subCategories,
      searchForm: searchAdminProductForm,
      handleAdminSearchProduct,
      handleFilterResetButtonClick,
      handleChangeCategory,
      handleSortChange,
    },
    resultProps: {
      deleteForm: deleteProductForm,
      products: products.data,
      paginationProps: products.paginationProps,
      handleTableRowClick,
      handleRemoveProduct,
    },
    handleGoToProductRegisterButtonClick,
  };
};

export default useAdminProductView;

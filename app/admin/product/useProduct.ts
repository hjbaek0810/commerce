import { useCallback, useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { useRouter } from 'next/navigation';

import { fetchData } from '@api/utils/fetch';
import { API } from '@api/utils/path';

import type { CategoryVO, SubCategoryVO } from '@api/category/types/vo';

export type ProductUseFormType = {
  name: string;
  price: number;
  salePrice?: number;
  categoryName?: string;
  categoryId?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'STOPPED';
};

const useProduct = () => {
  const router = useRouter();
  const [saleRate, setSaleRate] = useState<number>(0);
  const [categories, setCategories] = useState<Array<CategoryVO>>();

  const [subCategories, setSubCategories] = useState<Array<SubCategoryVO>>([]);

  const productForm = useForm<ProductUseFormType>({
    reValidateMode: 'onChange',
    defaultValues: {
      status: 'PENDING',
    },
  });

  const priceValue = useWatch({
    name: 'price',
    control: productForm.control,
  });

  const salePriceValue = useWatch({
    name: 'salePrice',
    control: productForm.control,
  });

  const selectedCategoryId = useWatch({
    name: 'categoryId',
    control: productForm.control,
  });

  useEffect(() => {
    fetchData<Array<CategoryVO>>(API.CATEGORY, 'GET').then(data =>
      setCategories(
        data.map(({ _id, name, subCategory }) => {
          return {
            _id,
            name,
            subCategory,
          };
        }),
      ),
    );
  }, []);

  useEffect(() => {
    if (!categories || !selectedCategoryId) return;

    const category = categories.find(
      category => category._id === selectedCategoryId,
    );

    setSubCategories(category?.subCategory ?? []);
  }, [selectedCategoryId, categories]);

  const calculateSaleRate = useCallback(() => {
    if (
      !priceValue ||
      !salePriceValue ||
      Number(priceValue) <= Number(salePriceValue)
    ) {
      setSaleRate(0);
    } else {
      const discountRate = ((priceValue - salePriceValue) / priceValue) * 100;
      setSaleRate(Math.round(discountRate));
    }
  }, [priceValue, salePriceValue]);

  useEffect(() => {
    calculateSaleRate();
  }, [calculateSaleRate]);

  const handleCategoryRegisterButton = () => {
    router.push('/admin/category');
  };

  return {
    productForm,
    saleRate,
    categories,
    subCategories,
    handleCategoryRegisterButton,
  };
};

export default useProduct;

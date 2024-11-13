import { useCallback, useEffect, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { useRouter } from 'next/navigation';

import { fetchData } from '@api/utils/fetch';
import { API } from '@api/utils/path';

import type { CategoryVO, SubCategoryVO } from '@api/category/types/vo';
import type { CreateProduct } from '@api/product/types/dto';

export type ProductUseFormType = Omit<
  CreateProduct,
  'images' | 'categoryIds'
> & {
  _id?: string; // detail
  categoryId: string;
  subCategoryId?: string;
  images?: FileList;
  deleteImageIds?: string[]; // detail
};

const useProductForm = () => {
  const router = useRouter();
  const [saleRate, setSaleRate] = useState<number>(0);
  const [categories, setCategories] = useState<Array<CategoryVO>>();

  const [subCategories, setSubCategories] = useState<Array<SubCategoryVO>>([]);

  const { control, setValue, getValues } = useFormContext<ProductUseFormType>();

  const priceValue = useWatch({
    name: 'price',
    control,
  });

  const salePriceValue = useWatch({
    name: 'salePrice',
    control,
  });

  const selectedCategoryId = useWatch({
    name: 'categoryId',
    control,
  });

  const selectedImages = useWatch({
    name: 'images',
    control,
  });

  const selectedDeleteImageIds = useWatch({
    name: 'deleteImageIds',
    control,
  });

  useEffect(() => {
    fetchData<Array<CategoryVO>>(API.CATEGORY, 'GET').then(data =>
      setCategories(
        data.map(({ _id, name, subCategories }) => {
          return {
            _id,
            name,
            subCategories,
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

    setSubCategories(category?.subCategories ?? []);
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

  const handleCategoryRegisterButton = () => router.push('/admin/category');

  const validateSubCategory = (value: string) => {
    if (!value && subCategories?.length > 0) return false;

    return true;
  };

  const validateImage = (value: FileList) => {
    const hasNonImageFile = Array.from(value).some(
      file => !file.type.includes('image'),
    );

    return !hasNonImageFile;
  };

  const handleDeleteImageToggleButtonClick = (imageId: string) => {
    const deletedImageIds = getValues('deleteImageIds') || [];

    if (deletedImageIds.includes(imageId)) {
      setValue(
        'deleteImageIds',
        deletedImageIds.filter(id => id !== imageId),
      );
    } else {
      setValue('deleteImageIds', [...deletedImageIds, imageId]);
    }
  };

  const isImageToBeDeleted = (imageId: string) =>
    selectedDeleteImageIds?.includes(imageId) ?? false;

  return {
    saleRate,
    categories,
    subCategories,
    selectedImages: selectedImages ? Array.from(selectedImages) : [],
    validateSubCategory,
    validateImage,
    isImageToBeDeleted,
    handleCategoryRegisterButton,
    handleDeleteImageToggleButtonClick,
  };
};

export default useProductForm;

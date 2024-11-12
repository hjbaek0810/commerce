import { useCallback, useEffect, useState, useTransition } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-toastify';

import { useRouter } from 'next/navigation';

import { fetchData } from '@api/utils/fetch';
import { API } from '@api/utils/path';
import { ProductStatusType } from '@api/utils/types/enum';
import { uploadImages } from 'actions/upload';

import type { CategoryVO, SubCategoryVO } from '@api/category/types/vo';
import type { CreateProduct } from '@api/product/types/dto';
import type { ProductVO } from '@api/product/types/vo';
import type { UploadApiResponse } from 'cloudinary';

export type ProductRegisterUseFormType = Omit<
  CreateProduct,
  'images' | 'categoryIds'
> & {
  categoryId: string;
  subCategoryId?: string;
  images?: FileList;
};

const useProductRegister = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [saleRate, setSaleRate] = useState<number>(0);
  const [categories, setCategories] = useState<Array<CategoryVO>>();

  const [subCategories, setSubCategories] = useState<Array<SubCategoryVO>>([]);

  const productForm = useForm<ProductRegisterUseFormType>({
    reValidateMode: 'onChange',
    defaultValues: {
      status: ProductStatusType.PENDING,
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

  const selectedImages = useWatch({
    name: 'images',
    control: productForm.control,
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

  const handleCategoryRegisterButton = () => router.push('/admin/category');

  const uploadImagesAndGetUrls = async (
    images: File[],
  ): Promise<UploadApiResponse[]> => {
    const formData = new FormData();
    images.forEach(item => formData.append('images', item));

    const imageResponse = await uploadImages(formData);
    if (imageResponse.images) {
      return imageResponse.images;
    } else {
      throw new Error('failed image upload');
    }
  };

  const saveProductToDB = async (productData: CreateProduct) => {
    const response = await fetchData<ProductVO, CreateProduct>(
      API.PRODUCT,
      'POST',
      {
        data: productData,
      },
    );

    return response;
  };

  const handleSubmit = (data: ProductRegisterUseFormType) => {
    startTransition(async () => {
      try {
        let imageResult: UploadApiResponse[] = [];

        // image upload in cloudinary
        if (data.images) {
          imageResult = await uploadImagesAndGetUrls(Array.from(data.images));
        }

        // save mongoDB
        const { categoryId, subCategoryId, images, ...restData } = data;
        const productData: CreateProduct = {
          ...restData,
          categoryIds: {
            _id: categoryId,
            subCategoryId,
          },
          images: imageResult.map(({ public_id, secure_url }) => ({
            publicId: public_id,
            secureUrl: secure_url,
          })),
        };

        await saveProductToDB(productData);

        router.push('/admin/product');
      } catch (error) {
        console.error(error);

        toast.error(
          '상품 등록에 실패하였습니다. 잠시 후 시도해주시길 바랍니다.',
          {
            position: 'bottom-right',
          },
        );
      }
    });
  };

  return {
    productForm,
    saleRate,
    categories,
    subCategories,
    selectedImages: selectedImages ? Array.from(selectedImages) : [],
    handleCategoryRegisterButton,
    handleSubmit,
    validateSubCategory,
    validateImage,
    isPending,
  };
};

export default useProductRegister;

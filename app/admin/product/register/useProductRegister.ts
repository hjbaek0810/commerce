import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { useRouter } from 'next/navigation';

import { fetchData } from '@api/utils/fetch';
import { API } from '@api/utils/path';
import { ProductStatusType } from '@api/utils/types/enum';
import { PATH } from '@utils/path';

import { uploadImagesAndGetUrls } from '../services';

import type { ProductUseFormType } from '../components/ProductForm/useProductForm';
import type { CreateProduct } from '@api/product/types/dto';
import type { ProductVO } from '@api/product/types/vo';
import type { UploadApiResponse } from 'cloudinary';

const useProductRegister = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const productForm = useForm<ProductUseFormType>({
    reValidateMode: 'onChange',
    defaultValues: {
      status: ProductStatusType.PENDING,
    },
  });

  const saveProductToDB = async (productData: CreateProduct) => {
    const response = await fetchData<ProductVO, CreateProduct>(
      API.PRODUCT.BASE,
      'POST',
      {
        data: productData,
      },
    );

    return response;
  };

  const handleSubmit = (data: ProductUseFormType) => {
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
          images: imageResult.map(({ public_id, secure_url, name }) => ({
            name,
            publicId: public_id,
            secureUrl: secure_url,
          })),
        };

        await toast.promise(
          async () => {
            await saveProductToDB(productData);
            router.push(PATH.ADMIN.PRODUCT.LIST);
          },
          {
            pending: 'in progress..',
            error: '상품 등록에 실패하였습니다. 잠시 후 시도해주시길 바랍니다.',
          },
        );
      } catch (error) {
        console.error(error);

        toast.error('상품 등록 중 오류가 발생했습니다. 다시 시도해주세요.', {
          position: 'bottom-right',
        });
      }
    });
  };

  return {
    productForm,
    handleSubmit,
    isPending,
  };
};

export default useProductRegister;

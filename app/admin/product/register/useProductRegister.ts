import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { useRouter } from 'next/navigation';

import { useAdminProductMutation } from '@services/queries/product';
import { isApiError } from '@services/utils/error';
import { ProductStatusType } from '@utils/constants/product';
import { PATH } from '@utils/path';

import type { ProductUseFormType } from '../components/ProductForm/useProductForm';

const useProductRegister = () => {
  const router = useRouter();

  const { mutate: registerProduct, isPending } = useAdminProductMutation();

  const productForm = useForm<ProductUseFormType>({
    reValidateMode: 'onChange',
    defaultValues: {
      status: ProductStatusType.PENDING,
    },
  });

  const handleSubmit = (data: ProductUseFormType) => {
    registerProduct(data, {
      onSuccess: () => {
        router.push(PATH.ADMIN.PRODUCT.LIST);
      },
      onError: error => {
        if (!isApiError(error)) {
          toast.error('이미지 업로드에 실패하였습니다. 다시 확인해주세요.');
        }
      },
    });
  };

  return {
    productForm,
    handleSubmit,
    isPending,
  };
};

export default useProductRegister;

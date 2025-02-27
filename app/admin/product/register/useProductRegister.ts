import { useForm } from 'react-hook-form';

import { useRouter } from 'next/navigation';

import { useAdminProductMutation } from '@services/queries/product';
import { ProductStatusType } from '@utils/constants/product';
import { PATH } from '@utils/path';

import type { ProductUseFormType } from '../components/ProductForm/useProductForm';

const useProductRegister = () => {
  const router = useRouter();

  const {
    mutate: registerProduct,
    isPending,
    isSuccess,
  } = useAdminProductMutation();

  const productForm = useForm<ProductUseFormType>({
    reValidateMode: 'onChange',
    defaultValues: {
      status: ProductStatusType.IN_PROGRESS,
    },
  });

  const handleSubmit = (data: ProductUseFormType) => {
    registerProduct(data, {
      onSuccess: () => {
        router.push(PATH.ADMIN.PRODUCT.LIST);
      },
    });
  };

  return {
    productForm,
    handleSubmit,
    isPending: isPending || isSuccess,
  };
};

export default useProductRegister;

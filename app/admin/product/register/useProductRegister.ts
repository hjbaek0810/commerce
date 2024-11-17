import { useForm } from 'react-hook-form';

import { useProductMutation } from '@queries/product';
import { useRouter } from 'next/navigation';

import { ProductStatusType } from '@api/utils/types/status';
import { PATH } from '@utils/path';

import type { ProductUseFormType } from '../components/ProductForm/useProductForm';

const useProductRegister = () => {
  const router = useRouter();

  const { mutate: registerProduct, isPending } = useProductMutation();

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
    });
  };

  return {
    productForm,
    handleSubmit,
    isPending,
  };
};

export default useProductRegister;

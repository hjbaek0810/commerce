import { useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  useProductDeleteMutation,
  useProductDetailMutation,
  useProductDetailQuery,
} from '@queries/product';
import { useParams, useRouter } from 'next/navigation';

import { ProductStatusType } from '@api/utils/types/status';
import PromptModal from '@components/Modal/templates/PromptModal';
import useModals from '@utils/hooks/useModals';

import type { ProductUseFormType } from '../components/ProductForm/useProductForm';

const useProductDetail = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.slug as string;

  const { data: product } = useProductDetailQuery(id);
  const { mutate: updateProduct, isPending } = useProductDetailMutation(id);
  const { mutate: deleteProduct, isPending: isDeletePending } =
    useProductDeleteMutation(id);

  const [editable, setEditable] = useState<boolean>(false);

  const { openModal } = useModals();

  const { categoryIds } = product || {};

  const defaultValue: ProductUseFormType = {
    _id: product?._id ?? '',
    name: product?.name ?? '',
    quantity: product?.quantity ?? 0,
    price: product?.price ?? 0,
    salePrice: product?.salePrice ?? null,
    status: product?.status ?? ProductStatusType.PENDING,
    categoryId: categoryIds?._id ?? '',
    subCategoryId: categoryIds?.subCategoryId,
    description: product?.description,
  };

  const productForm = useForm<ProductUseFormType>({
    reValidateMode: 'onChange',
    values: defaultValue,
  });

  const handleSubmit = (data: ProductUseFormType) => {
    updateProduct(data, {
      onSuccess: () => {
        setEditable(false);
        productForm.setValue('images', undefined);
      },
    });
  };

  const handleEditClick = () => {
    setEditable(true);
  };

  const handleCancelClick = () => {
    setEditable(false);
    productForm.reset(defaultValue);
  };

  const handleBackClick = () => router.back();

  const handleDeleteClick = () => {
    openModal(PromptModal, {
      message: '해당 상품을 삭제하시겠습니까?',
      onSubmit: () => {
        deleteProduct(product?.images, {
          onSuccess: router.back,
        });
      },
    });
  };

  return {
    productForm,
    savedImages: product?.images || [],
    editable,
    isPending: isPending || isDeletePending,
    handleEditClick,
    handleCancelClick,
    handleBackClick,
    handleDeleteClick,
    handleSubmit,
  };
};

export default useProductDetail;

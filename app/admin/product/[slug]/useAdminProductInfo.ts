import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useParams, useRouter } from 'next/navigation';

import PromptModal from '@components/Modal/templates/PromptModal';
import {
  useAdminProductDeleteMutation,
  useAdminProductDetailMutation,
  useAdminProductDetailQuery,
} from '@services/queries/product';
import { ProductStatusType } from '@utils/constants/product';
import useModals from '@utils/hooks/useModals';

import type { ProductUseFormType } from '../components/ProductForm/useProductForm';

const useAdminProductInfo = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.slug as string;

  const { data: product } = useAdminProductDetailQuery(id);
  const { mutate: updateProduct, isPending } =
    useAdminProductDetailMutation(id);
  const { mutate: deleteProduct, isPending: isDeletePending } =
    useAdminProductDeleteMutation();

  const [editable, setEditable] = useState<boolean>(false);

  const { openModal } = useModals();

  const { categoryIds } = product || {};

  const defaultValue: ProductUseFormType = {
    _id: product?._id ?? '',
    name: product?.name ?? '',
    quantity: product?.quantity ?? 0,
    price: product?.price ?? 0,
    salePrice: product?.salePrice ?? null,
    status: product?.status ?? ProductStatusType.IN_PROGRESS,
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

  const handleDeleteClick = () => {
    openModal(PromptModal, {
      message: '해당 상품을 삭제하시겠습니까?',
      onSubmit: () => {
        deleteProduct(
          {
            _id: id,
            deleteImageIds: product?.images.map(({ publicId }) => publicId),
          },
          {
            onSuccess: () => {
              router.back();
            },
          },
        );
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
    handleDeleteClick,
    handleSubmit,
  };
};

export default useAdminProductInfo;

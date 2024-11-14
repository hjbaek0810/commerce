import { useCallback, useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { useParams, useRouter } from 'next/navigation';

import { deleteImages } from '@actions/upload';
import { fetchData } from '@api/utils/fetch';
import { API } from '@api/utils/path';
import { ProductStatusType } from '@api/utils/types/enum';
import PromptModal from '@components/Modal/templates/PromptModal';
import useModals from '@utils/hooks/useModals';

import { uploadImagesAndGetUrls } from '../services';

import type { ProductUseFormType } from '../components/ProductForm/useProductForm';
import type { UpdateProduct } from '@api/product/types/dto';
import type { ProductDetailVO } from '@api/product/types/vo';
import type { UploadApiResponse } from 'cloudinary';

const useProductDetail = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.slug as string;

  const [editable, setEditable] = useState<boolean>(false);
  const [product, setProduct] = useState<ProductDetailVO>();

  const { openModal } = useModals();

  const [isPending, startTransition] = useTransition();

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

  const fetchProducts = useCallback(() => {
    toast.promise(
      fetchData<ProductDetailVO>(API.PRODUCT.DETAIL(id), 'GET').then(data =>
        setProduct(data),
      ),
      {
        pending: 'Loading...',
      },
    );
  }, [id]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateProductToDB = async (productData: UpdateProduct) => {
    const response = await fetchData<ProductDetailVO, UpdateProduct>(
      API.PRODUCT.DETAIL(id),
      'PUT',
      {
        data: productData,
      },
    );

    return response;
  };

  const handleSubmit = async (data: ProductUseFormType) => {
    startTransition(async () => {
      try {
        // image upload in cloudinary
        let imageResult: UploadApiResponse[] = [];
        if (data.images) {
          imageResult = await uploadImagesAndGetUrls(Array.from(data.images));
        }

        // save mongoDB
        const { _id, categoryId, subCategoryId, deleteImageIds, ...restData } =
          data;

        const productData: UpdateProduct = {
          ...restData,
          _id: _id ?? '',
          categoryIds: {
            _id: categoryId,
            subCategoryId,
          },
          images: imageResult.map(({ public_id, secure_url, name }) => ({
            name,
            publicId: public_id,
            secureUrl: secure_url,
          })),
          deleteImageIds,
        };

        await toast.promise(
          (async () => {
            const updateProductPromise = updateProductToDB(productData);
            const deleteImagesPromise =
              deleteImageIds && deleteImageIds.length > 0
                ? Promise.all(deleteImageIds.map(id => deleteImages(id)))
                : Promise.resolve();

            await Promise.all([updateProductPromise, deleteImagesPromise]);

            fetchProducts();
            setEditable(false);
            productForm.setValue('images', undefined);
          })(),
          {
            pending: 'in progress..',
            success: '상품이 성공적으로 수정되었습니다.',
            error: '상품 수정에 실패하였습니다. 잠시 후 시도해주시길 바랍니다.',
          },
        );
      } catch (error) {
        console.error(error);

        toast.error('상품 수정 중 오류가 발생했습니다. 다시 시도해주세요.', {
          position: 'bottom-right',
        });
      }
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

  const handleDeleteClick = async () => {
    openModal(PromptModal, {
      message: '해당 상품을 삭제하시겠습니까?',
      onSubmit: async () => {
        await toast.promise(
          Promise.all([
            fetchData(API.PRODUCT.DETAIL(id), 'DELETE'),
            ...(product?.images
              ? product.images.map(({ publicId }) => deleteImages(publicId))
              : []),
          ]),
          {
            pending: 'in progress..',
            error: '상품 삭제에 실패하였습니다. 잠시 후 시도해주시길 바랍니다.',
          },
        );

        router.back();
      },
    });
  };

  return {
    productForm,
    savedImages: product?.images || [],
    editable,
    isPending,
    handleEditClick,
    handleCancelClick,
    handleBackClick,
    handleDeleteClick,
    handleSubmit,
  };
};

export default useProductDetail;

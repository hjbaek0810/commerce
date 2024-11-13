import { startTransition, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import type { UploadApiResponse } from 'cloudinary';
import { isEmpty } from 'lodash-es';
import { useParams } from 'next/navigation';

import { deleteImages } from '@actions/upload';

import { fetchData } from '@api/utils/fetch';
import { API } from '@api/utils/path';
import { ProductStatusType } from '@api/utils/types/enum';

import { uploadImagesAndGetUrls } from '../services';

import type { ProductUseFormType } from '../components/ProductForm/useProductForm';
import type { UpdateProduct } from '@api/product/types/dto';
import type { ProductDetailVO } from '@api/product/types/vo';

const useProductDetail = () => {
  const params = useParams();
  const id = params.slug as string;

  const [editable, setEditable] = useState<boolean>(false);
  const [product, setProduct] = useState<ProductDetailVO>();

  const { categoryIds } = product || {};

  const defaultValue: ProductUseFormType = {
    _id: product?._id ?? '',
    name: product?.name ?? '',
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
    fetchData<ProductDetailVO>(API.PRODUCT.DETAIL(id), 'GET').then(data =>
      setProduct(data),
    );
  }, []);

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

  const handleSubmit = (data: ProductUseFormType) => {
    startTransition(async () => {
      try {
        let imageResult: UploadApiResponse[] = [];

        // image upload in cloudinary
        if (data.images) {
          imageResult = await uploadImagesAndGetUrls(Array.from(data.images));
        }

        // save mongoDB
        const {
          _id,
          categoryId,
          subCategoryId,
          images,
          deleteImageIds,
          ...restData
        } = data;

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

        await updateProductToDB(productData);

        if (deleteImageIds && !isEmpty(deleteImageIds)) {
          await Promise.all(deleteImageIds.map(id => deleteImages(id)));
        }
      } catch (error) {
        console.error(error);

        toast.error(
          '상품 수정에 실패하였습니다. 잠시 후 시도해주시길 바랍니다.',
          {
            position: 'bottom-right',
          },
        );
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

  return {
    productForm,
    savedImages: product?.images || [],
    editable,
    handleEditClick,
    handleCancelClick,
    handleSubmit,
  };
};

export default useProductDetail;

import { toast } from 'react-toastify';

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { isEmpty } from 'lodash-es';

import { fetchData } from '@api/utils/fetch';
import { API } from '@api/utils/path';
import { createQueryString } from '@api/utils/query';
import { deleteImages, uploadImages } from '@services/upload';
import useQueryPagination from '@utils/hooks/useQueryPagination';

import type { CreateProduct, UpdateProduct } from '@api/product/types/dto';
import type {
  ImageVO,
  ProductDetailVO,
  ProductVO,
} from '@api/product/types/vo';
import type { PaginatedResponse } from '@api/utils/types/pagination';
import type { ProductUseFormType } from 'app/admin/product/components/ProductForm/useProductForm';
import type { UploadApiResponse } from 'cloudinary';

type ProductsType = PaginatedResponse<'products', ProductVO>;

async function uploadImagesAndGetUrls(
  images: File[],
): Promise<UploadApiResponse[]> {
  const formData = new FormData();
  images.forEach(item => formData.append('images', item));

  try {
    const imageResponse = await uploadImages(formData);
    if (imageResponse.images) {
      return imageResponse.images;
    } else {
      throw new Error('Image upload failed: No images returned.');
    }
  } catch (error) {
    console.error(error);

    throw new Error('Failed to upload images and get URLs.');
  }
}

export const useProductListQuery = () => {
  const { paginationProps } = useQueryPagination();

  const { data, ...rest } = useQuery({
    queryKey: [
      'products',
      {
        page: paginationProps.currentPage,
        limit: paginationProps.currentLimit,
      },
    ],
    queryFn: () =>
      fetchData<ProductsType>(
        createQueryString(API.PRODUCT.BASE, {
          page: paginationProps.currentPage,
          limit: paginationProps.currentLimit,
        }),
        'GET',
      ),
    placeholderData: keepPreviousData,
  });

  return {
    ...rest,
    data: data?.products || [],
    paginationProps: {
      ...paginationProps,
      totalCount: data?.totalCount || 0,
    },
  };
};

export const useProductDetailQuery = (id: string) =>
  useQuery({
    queryKey: ['products', 'item', id],
    queryFn: () => fetchData<ProductDetailVO>(API.PRODUCT.DETAIL(id), 'GET'),
  });

export const useProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ProductUseFormType) => {
      let imageResult: UploadApiResponse[] = [];

      // image upload in cloudinary
      if (data.images && !isEmpty(data.images)) {
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

      return fetchData<ProductVO, CreateProduct>(API.PRODUCT.BASE, 'POST', {
        data: productData,
      });
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['products'],
        refetchType: 'all',
      }),
    onError: () => {
      toast.error('상품 등록에 실패하였습니다. 잠시 후 시도해주시길 바랍니다.');
    },
  });
};

export const useProductDetailMutation = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ProductUseFormType) => {
      try {
        let imageResult: UploadApiResponse[] = [];

        // image upload in cloudinary
        if (data.images && !isEmpty(data.images)) {
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

        const updateProductPromise = fetchData<ProductDetailVO, UpdateProduct>(
          API.PRODUCT.DETAIL(id),
          'PUT',
          { data: productData },
        );

        const deleteImagesPromise =
          deleteImageIds && deleteImageIds.length > 0
            ? Promise.all(deleteImageIds.map(id => deleteImages(id)))
            : Promise.resolve();

        return await Promise.all([updateProductPromise, deleteImagesPromise]);
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['products'],
        refetchType: 'all',
      }),
    onError: () => {
      toast.error('상품 수정에 실패하였습니다. 잠시 후 시도해주시길 바랍니다.');
    },
  });
};

export const useProductDeleteMutation = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (images?: ImageVO[]) =>
      Promise.all([
        fetchData(API.PRODUCT.DETAIL(id), 'DELETE'),
        ...(images ? images.map(({ publicId }) => deleteImages(publicId)) : []),
      ]),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['products'],
        refetchType: 'all',
      }),
    onError: () => {
      toast.error('상품 삭제에 실패하였습니다. 잠시 후 시도해주시길 바랍니다.');
    },
  });
};

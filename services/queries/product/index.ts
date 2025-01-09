import { toast } from 'react-toastify';

import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { isEmpty } from 'lodash-es';
import { useSearchParams } from 'next/navigation';

import { getAdminCategoriesQueryOptions } from '@services/queries/category/options';
import { orderKeys } from '@services/queries/order/keys';
import { productKeys } from '@services/queries/product/keys';
import {
  getAdminProductDetailQueryOptions,
  getAdminProductListQueryOptions,
  getProductDetailQueryOptions,
  getProductListInfiniteQueryOptions,
  getSortedProductListQueryOptions,
} from '@services/queries/product/options';
import { getWishListQueryOptions } from '@services/queries/wish-list/options';
import { deleteImages, uploadImages } from '@services/upload';
import { CloudinaryError } from '@services/upload/exception';
import { FileUploadError, isFileUploadError } from '@services/utils/error';
import { fetchData } from '@services/utils/fetch';
import { invalidateQueries, removeQueries } from '@services/utils/helper';
import { API } from '@services/utils/path';
import { ProductSortType } from '@utils/constants/product';
import usePaginationQueryParams from '@utils/hooks/usePaginationQueryParams';
import useQueryParams from '@utils/hooks/useQueryParams';
import { parseQueryParams } from '@utils/query/helper';

import type {
  CreateAdminProduct,
  DeleteAdminProduct,
  DeleteAdminProducts,
  UpdateAdminProduct,
} from '@api/admin/product/types/dto';
import type {
  AdminProductDetailVO,
  AdminProductVO,
} from '@api/admin/product/types/vo';
import type { ProductVO } from '@api/product/types/vo';
import type { PaginatedResponse } from '@services/utils/types/pagination';
import type { ProductUseFormType } from 'app/admin/product/components/ProductForm/useProductForm';
import type { UploadApiResponse } from 'cloudinary';

async function uploadImagesAndGetUrls(
  images: File[],
): Promise<UploadApiResponse[]> {
  const formData = new FormData();
  images.forEach(item => formData.append('images', item));

  try {
    const imageResponse = await uploadImages(formData);
    if (imageResponse.images) {
      return imageResponse.images;
    }

    throw new FileUploadError(
      CloudinaryError.UPLOAD_FAILED.message,
      CloudinaryError.UPLOAD_FAILED.code,
    );
  } catch (error) {
    console.error(error);

    throw error;
  }
}

export const useAdminProductListWithCategoryQueries = () => {
  const searchParams = useSearchParams();
  const queryParams = parseQueryParams(searchParams);
  const { paginationProps, handleSearchParamsChange } =
    usePaginationQueryParams();

  const products = useQuery({
    ...getAdminProductListQueryOptions({
      searchParams: queryParams,
      page: paginationProps.currentPage,
      limit: paginationProps.currentLimit,
    }),
    placeholderData: keepPreviousData, // useQueries X
    enabled: !!searchParams,
  });

  const categories = useQuery(getAdminCategoriesQueryOptions());

  return {
    products: {
      ...products,
      data: products?.data?.products || [],
      paginationProps: {
        ...paginationProps,
        totalCount: products?.data?.totalCount || 0,
      },
    },
    categories: {
      ...categories,
      data: categories?.data || [],
    },
    handleSearchParamsChange,
  };
};

export const useSortedProductListQueries = () => {
  const [newProducts, popularProducts] = useQueries({
    queries: [
      {
        ...getSortedProductListQueryOptions(ProductSortType.NEWEST),
        select: (data: PaginatedResponse<'products', ProductVO>) => {
          const sixtyDaysAgo = new Date();
          sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

          return data.products.filter(product => {
            const productDate = new Date(product.createdAt);

            return productDate >= sixtyDaysAgo; // 60일 이내의 상품만 필터링
          });
        },
      },
      {
        ...getSortedProductListQueryOptions(ProductSortType.POPULARITY),
        select: (data: PaginatedResponse<'products', ProductVO>) =>
          data.products,
      },
    ],
  });

  return {
    newProducts,
    popularProducts,
  };
};

export const useProductListInfiniteQuery = () => {
  const searchParams = useSearchParams();
  const queryParams = parseQueryParams(searchParams);

  const { changeSearchParams } = useQueryParams();

  const { data, ...rest } = useInfiniteQuery(
    getProductListInfiniteQueryOptions(queryParams),
  );

  return {
    ...rest,
    products: data?.pages.flatMap(page => page.products) || [],
    changeSearchParams,
  };
};

export const useAdminProductDetailQuery = (id: string) =>
  useQuery(getAdminProductDetailQueryOptions(id));

export const useAdminProductMutation = () => {
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
      const productData: CreateAdminProduct = {
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

      return fetchData<AdminProductVO, CreateAdminProduct>(
        API.ADMIN.PRODUCT.BASE,
        'POST',
        {
          data: productData,
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: productKeys.getAdminAll(),
      });
    },
    onError: error => {
      if (isFileUploadError(error)) {
        toast.error(
          '이미지 업로드에 실패했습니다. 이미지 형식과 크기를 확인한 후 다시 시도해주세요.',
        );
      }
    },
  });
};

export const useAdminProductDetailMutation = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ProductUseFormType) => {
      let imageResult: UploadApiResponse[] = [];

      // image upload in cloudinary
      if (data.images && !isEmpty(data.images)) {
        imageResult = await uploadImagesAndGetUrls(Array.from(data.images));
      }

      // save mongoDB
      const { _id, categoryId, subCategoryId, deleteImageIds, ...restData } =
        data;

      const productData: UpdateAdminProduct = {
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

      const UpdateAdminProductPromise = fetchData<
        AdminProductDetailVO,
        UpdateAdminProduct
      >(API.ADMIN.PRODUCT.DETAIL(id), 'PUT', { data: productData });

      const deleteImagesPromise =
        deleteImageIds && deleteImageIds.length > 0
          ? Promise.all(deleteImageIds.map(id => deleteImages(id)))
          : Promise.resolve();

      return await Promise.all([
        UpdateAdminProductPromise,
        deleteImagesPromise,
      ]);
    },
    onSuccess: () => {
      invalidateQueries(queryClient, [
        productKeys.getAdminDetail(id),
        productKeys.getAdminAll(),
        orderKeys.getAdminAll(),
      ]);
    },
    onError: error => {
      if (isFileUploadError(error)) {
        toast.error(
          '이미지 업로드에 실패했습니다. 이미지 형식과 크기를 확인한 후 다시 시도해주세요.',
        );
      }
    },
  });
};

export const useAdminProductDeleteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DeleteAdminProduct) => {
      const deleteImageIds = data?.deleteImageIds || [];

      return Promise.all([
        fetchData(API.ADMIN.PRODUCT.DETAIL(data._id), 'DELETE', { data }),
        ...(deleteImageIds.length > 0
          ? deleteImageIds.map(publicId => deleteImages(publicId))
          : []),
      ]);
    },
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: productKeys.getAdminAll(),
          refetchType: 'all',
        }),

        queryClient.removeQueries({
          queryKey: productKeys.getAdminDetail(variables._id),
        }),
      ]);
    },
    onError: error => {
      if (isFileUploadError(error)) {
        toast.error(
          '상품 삭제 요청이 실패했습니다. 다시 시도해주시기 바랍니다.',
        );
      }
    },
  });
};

export const useAdminProductMultiDeleteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DeleteAdminProducts) => {
      const deleteImageIds = data
        .map(({ deleteImageIds }) => deleteImageIds || [])
        .flat();

      return Promise.all([
        fetchData(API.ADMIN.PRODUCT.BASE, 'DELETE', {
          data,
        }),
        ...(deleteImageIds.length > 0
          ? deleteImageIds.map(publicId => deleteImages(publicId))
          : []),
      ]);
    },
    onSuccess: (_, variables) => {
      const deleteImageIds = variables
        .map(({ deleteImageIds }) => deleteImageIds || [])
        .flat();

      invalidateQueries(queryClient, [
        productKeys.getAdminAll(),
        orderKeys.getAdminAll(),
      ]);

      removeQueries(
        queryClient,
        deleteImageIds.map(id => productKeys.getAdminDetail(id)),
      );
    },
    onError: error => {
      if (isFileUploadError(error)) {
        toast.error(
          '상품 삭제 요청이 실패했습니다. 다시 시도해주시기 바랍니다.',
        );
      }
    },
  });
};

export const useProductDetailQuery = (id: string, isAuthenticated: boolean) => {
  const [productDetail, wish] = useQueries({
    queries: [
      getProductDetailQueryOptions(id),
      { ...getWishListQueryOptions(), enabled: isAuthenticated },
    ],
  });

  const isWished =
    (wish && wish.data?.items?.some(item => item._id.toString() === id)) ||
    false;

  return {
    ...productDetail,
    isWished,
  };
};

export const useProductDetailWhenNewOrderQuery = (
  id: string,
  quantity: number,
  fromCart: boolean,
) =>
  useQuery({
    ...getProductDetailQueryOptions(id),
    select: data => {
      return {
        _id: data._id,
        items: [
          {
            product: {
              _id: data._id,
              name: data.name,
              images: data.images,
              price: data.price,
              salePrice: data.salePrice,
              quantity: data.quantity,
            },
            quantity,
          },
        ],
      };
    },
    enabled: !fromCart,
  });

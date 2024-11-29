import { toast } from 'react-toastify';

import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
  useSuspenseInfiniteQuery,
} from '@tanstack/react-query';
import { isEmpty } from 'lodash-es';
import { useSearchParams } from 'next/navigation';

import { deleteImages, uploadImages } from '@services/upload';
import { fetchData } from '@services/utils/fetch';
import { API } from '@services/utils/path';
import useQueryParams from '@utils/hooks/useQueryParams';
import { createQueryString, parseQueryParams } from '@utils/query/helper';

import type {
  CreateProduct,
  UpdateProduct,
} from '@api/admin/product/types/dto';
import type {
  AdminImageVO,
  AdminProductDetailVO,
  AdminProductVO,
} from '@api/admin/product/types/vo';
import type { ProductDetailVO, ProductVO } from '@api/product/types/vo';
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
    } else {
      throw new Error('Image upload failed: No images returned.');
    }
  } catch (error) {
    console.error(error);

    throw new Error('Failed to upload images and get URLs.');
  }
}

export const useAdminProductListQuery = () => {
  const { paginationProps } = useQueryParams();

  const { data, ...rest } = useQuery({
    queryKey: [
      'products',
      'admin',
      { scope: 'list' },
      {
        page: paginationProps.currentPage,
        limit: paginationProps.currentLimit,
      },
    ],
    queryFn: () =>
      fetchData<PaginatedResponse<'products', AdminProductVO>>(
        createQueryString(API.ADMIN.PRODUCT.BASE, {
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

export const useProductListInfiniteQuery = () => {
  const searchParams = useSearchParams();
  const queryParams = parseQueryParams(searchParams);
  const { handleSearchParamsChange } = useQueryParams();

  const LIMIT_ITEM = 10;

  const fetchProducts = async ({ pageParam = 1 }) => {
    const response = await fetchData<PaginatedResponse<'products', ProductVO>>(
      createQueryString(API.PRODUCT.BASE, {
        page: pageParam,
        limit: LIMIT_ITEM,
        ...queryParams,
      }),
      'GET',
    );

    return response;
  };

  const { data, ...rest } = useSuspenseInfiniteQuery({
    queryKey: ['products', { scope: 'list' }, queryParams],
    queryFn: fetchProducts,
    getNextPageParam: lastPage => {
      const { currentPage, totalCount } = lastPage;
      if (currentPage * LIMIT_ITEM < totalCount) {
        return lastPage.currentPage + 1;
      }
    },
    initialPageParam: 1,
  });

  return {
    ...rest,
    products: data?.pages.flatMap(page => page.products) || [],
    handleSearchParamsChange,
  };
};

export const useAdminProductDetailQuery = (id: string) =>
  useQuery({
    queryKey: ['products', 'admin', { scope: 'item' }, id],
    queryFn: () =>
      fetchData<AdminProductDetailVO>(API.ADMIN.PRODUCT.DETAIL(id), 'GET'),
  });

export const useProductDetailQuery = (id: string) =>
  useQuery({
    queryKey: ['products', { scope: 'item' }, id],
    queryFn: () => fetchData<ProductDetailVO>(API.PRODUCT.DETAIL(id), 'GET'),
  });

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

      return fetchData<AdminProductVO, CreateProduct>(
        API.ADMIN.PRODUCT.BASE,
        'POST',
        {
          data: productData,
        },
      );
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

      const updateProductPromise = fetchData<
        AdminProductDetailVO,
        UpdateProduct
      >(API.ADMIN.PRODUCT.DETAIL(id), 'PUT', { data: productData });

      const deleteImagesPromise =
        deleteImageIds && deleteImageIds.length > 0
          ? Promise.all(deleteImageIds.map(id => deleteImages(id)))
          : Promise.resolve();

      return await Promise.all([updateProductPromise, deleteImagesPromise]);
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

export const useAdminProductDeleteMutation = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (images?: AdminImageVO[]) =>
      Promise.all([
        fetchData(API.ADMIN.PRODUCT.DETAIL(id), 'DELETE'),
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

export const useProductTopViewsQuery = () =>
  useQuery({
    queryKey: ['products', { status: 'top-views' }],
    queryFn: () => fetchData<ProductVO[]>(API.PRODUCT.TOP_VIEWS, 'GET'),
  });

export const useProductDetailWithTopViews = (id: string) => {
  const [productDetail, topViews] = useQueries({
    queries: [
      {
        queryKey: ['products', { scope: 'item' }, id],
        queryFn: () =>
          fetchData<ProductDetailVO>(API.PRODUCT.DETAIL(id), 'GET'),
      },
      {
        queryKey: ['products', { status: 'top-views' }],
        queryFn: () => fetchData<ProductVO[]>(API.PRODUCT.TOP_VIEWS, 'GET'),
      },
    ],
  });

  const { data, ...restProduct } = productDetail;
  const isTop10 = topViews.data?.some(product => product._id === id);

  return {
    data: {
      ...data,
      isTop10,
    },
    ...restProduct,
  };
};

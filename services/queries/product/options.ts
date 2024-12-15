import { productKeys, productTags } from '@services/queries/product/keys';
import { fetchData } from '@services/utils/fetch';
import { API } from '@services/utils/path';
import { createQueryString } from '@utils/query/helper';

import type { SearchAdminProduct } from '@api/admin/product/types/dto';
import type {
  AdminProductDetailVO,
  AdminProductVO,
} from '@api/admin/product/types/vo';
import type { SearchProduct } from '@api/product/types/dto';
import type { ProductDetailVO, ProductVO } from '@api/product/types/vo';
import type {
  PaginatedResponse,
  PaginationQueryParamsType,
} from '@services/utils/types/pagination';

const PRODUCT_LIST_LIMIT_ITEM = 10;

export const getProductListQueryOptions = () => ({
  queryKey: productKeys.getAll(),
  queryFn: () =>
    fetchData<PaginatedResponse<'products', ProductVO>>(
      API.PRODUCT.BASE,
      'GET',
      {
        next: { tags: [productTags.all, productTags.list] },
      },
    ),
});

export const getProductListInfiniteQueryOptions = (
  searchParams: PaginationQueryParamsType<SearchProduct>,
) => ({
  queryKey: productKeys.getAll(searchParams),
  queryFn: ({ pageParam = 1 }) =>
    fetchData<PaginatedResponse<'products', ProductVO>>(
      createQueryString(API.PRODUCT.BASE, {
        ...searchParams,
        page: pageParam,
        limit: PRODUCT_LIST_LIMIT_ITEM,
      }),
      'GET',
      { next: { tags: [productTags.all, productTags.list] } },
    ),
  getNextPageParam: (lastPage: PaginatedResponse<'products', ProductVO>) => {
    const { currentPage, totalCount } = lastPage || {};

    if (currentPage * PRODUCT_LIST_LIMIT_ITEM < totalCount) {
      return lastPage.currentPage + 1;
    }
  },
  initialPageParam: 1,
});

export const getProductDetailQueryOptions = (id: string) => ({
  queryKey: productKeys.getDetail(id),
  queryFn: () =>
    fetchData<ProductDetailVO>(API.PRODUCT.DETAIL(id), 'GET', {
      next: { tags: [productTags.all, productTags.detail(id)] },
    }),
});

export const getAdminProductListQueryOptions = ({
  searchParams,
  page,
  limit,
}: {
  searchParams: PaginationQueryParamsType<SearchAdminProduct>;
  page: number;
  limit: number;
}) => ({
  queryKey: productKeys.getAdminAll({
    ...searchParams,
    page,
    limit,
  }),
  queryFn: () =>
    fetchData<PaginatedResponse<'products', AdminProductVO>>(
      createQueryString(API.ADMIN.PRODUCT.BASE, {
        page,
        limit,
      }),
      'GET',
      { next: { tags: [productTags.all, productTags.adminList] } },
    ),
});

export const getAdminProductDetailQueryOptions = (id: string) => ({
  queryKey: productKeys.getAdminDetail(id),
  queryFn: () =>
    fetchData<AdminProductDetailVO>(API.ADMIN.PRODUCT.DETAIL(id), 'GET', {
      next: { tags: [productTags.all, productTags.adminDetail(id)] },
    }),
});

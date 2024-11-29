import { Suspense } from 'react';

import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import LoadingSpinner from '@components/Loading';
import Title from '@components/Title';
import { fetchData } from '@services/utils/fetch';
import { API } from '@services/utils/path';
import { createQueryString } from '@utils/query/helper';
import { getQueryClient } from '@utils/query/queryClient';
import BestProductSlider from 'app/product/BestProductSlider';

import ProductListTable from './ProductListTable';

import type { ProductVO } from '@api/product/types/vo';
import type { PaginatedResponse } from '@services/utils/types/pagination';

const LIMIT_ITEM = 10;

const ProductList = async ({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) => {
  const allProductListPage = !('category' in searchParams);

  const queryClient = getQueryClient();

  const fetchProducts = async ({ pageParam = 1 }) => {
    const response = await fetchData<PaginatedResponse<'products', ProductVO>>(
      createQueryString(API.PRODUCT.BASE, {
        page: pageParam,
        limit: LIMIT_ITEM,
        ...searchParams,
      }),
      'GET',
    );

    return response;
  };

  await Promise.all([
    queryClient.prefetchInfiniteQuery({
      queryKey: ['products', { scope: 'list' }, searchParams],
      queryFn: fetchProducts,
      getNextPageParam: (
        lastPage: PaginatedResponse<'products', ProductVO>,
      ) => {
        const { currentPage, totalCount } = lastPage;
        if (currentPage * LIMIT_ITEM < totalCount) {
          return lastPage.currentPage + 1;
        }
      },
      initialPageParam: 1,
    }),
    ...(allProductListPage
      ? [
          queryClient.prefetchQuery({
            queryKey: ['products', { status: 'top-views' }],
            queryFn: () => fetchData<ProductVO[]>(API.PRODUCT.TOP_VIEWS, 'GET'),
          }),
        ]
      : []),
  ]);

  return (
    <>
      <Title>상품 목록</Title>

      <Suspense fallback={<LoadingSpinner />}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          {allProductListPage && <BestProductSlider />}
          <ProductListTable />
        </HydrationBoundary>
      </Suspense>
    </>
  );
};

export default ProductList;

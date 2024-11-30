import { Suspense } from 'react';

import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import LoadingSpinner from '@components/Loading';
import Title from '@components/Title';
import { getProductListInfiniteQueryOptions } from '@services/queries/product/options';
import { getQueryClient } from '@utils/query/queryClient';
import BestProductSlider from 'app/product/BestProductSlider';

import ProductListTable from './ProductListTable';

const ProductList = async ({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) => {
  const allProductListPage = !('category' in searchParams);

  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery(
    getProductListInfiniteQueryOptions(searchParams),
  );

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

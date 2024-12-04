import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import Title from '@components/Title';
import {
  getProductListInfiniteQueryOptions,
  getProductTopViewsQueryOptions,
} from '@services/queries/product/options';
import { getQueryClient } from '@utils/query/queryClient';
import BestProductSlider from 'app/product/BestProductSlider';

import ProductGrid from './ProductGrid';

const ProductList = async ({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) => {
  const allProductListPage = !('category' in searchParams);

  const queryClient = getQueryClient();

  await Promise.all([
    ...(allProductListPage ? [getProductTopViewsQueryOptions()] : []),
    getProductListInfiniteQueryOptions(searchParams),
  ]);

  return (
    <>
      <Title>상품 목록</Title>

      {allProductListPage && (
        <HydrationBoundary state={dehydrate(queryClient)}>
          <BestProductSlider />
        </HydrationBoundary>
      )}

      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProductGrid />
      </HydrationBoundary>
    </>
  );
};

export default ProductList;

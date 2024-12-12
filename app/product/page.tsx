import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import Title from '@components/Title';
import { getProductListInfiniteQueryOptions } from '@services/queries/product/options';
import { getQueryClient } from '@utils/query/queryClient';

import ProductGrid from './ProductGrid';

const ProductList = async ({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) => {
  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery(
    getProductListInfiniteQueryOptions(searchParams),
  );

  return (
    <>
      <Title>상품 목록</Title>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProductGrid />
      </HydrationBoundary>
    </>
  );
};

export default ProductList;

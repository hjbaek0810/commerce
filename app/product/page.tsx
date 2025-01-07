import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import Title from '@components/Title';
import { getProductListInfiniteQueryOptions } from '@services/queries/product/options';
import { getQueryClient } from '@utils/query/queryClient';

import ProductGrid from './ProductGrid';

import type { Metadata } from 'next/types';

export const metadata: Metadata = {
  title: '상품 목록 | MiniMall',
  description: 'MiniMall에서 다양한 상품을 만나보세요!',
  openGraph: {
    title: '상품 목록 | MiniMall',
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/product`,
    description: 'MiniMall에서 원하는 상품을 찾아보세요!',
  },
};

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

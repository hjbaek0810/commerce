import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { headers } from 'next/headers';

import Title from '@components/Title';
import { getProductDetailQueryOptions } from '@services/queries/product/options';
import { getWishListQueryOptions } from '@services/queries/wish-list/options';
import { getQueryClient } from '@utils/query/queryClient';

import ProductInfo from './ProductInfo';

const ProductDetail = async ({ params }: { params: { slug: string } }) => {
  const id = params.slug as string;

  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery(getProductDetailQueryOptions(id)),
    queryClient.prefetchQuery(getWishListQueryOptions(headers())),
  ]);

  return (
    <>
      <Title showBackButton>상품 상세</Title>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProductInfo id={id} />
      </HydrationBoundary>
    </>
  );
};

export default ProductDetail;

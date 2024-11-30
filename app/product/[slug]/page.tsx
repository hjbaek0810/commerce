import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import Title from '@components/Title';
import { getProductDetailQueryOptions } from '@services/queries/product/options';
import { getQueryClient } from '@utils/query/queryClient';

import ProductInfo from './ProductInfo';

const ProductDetail = async ({ params }: { params: { slug: string } }) => {
  const id = params.slug as string;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(getProductDetailQueryOptions(id));

  return (
    <>
      <Title>상품 상세</Title>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProductInfo id={id} />
      </HydrationBoundary>
    </>
  );
};

export default ProductDetail;

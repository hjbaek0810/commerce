import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import Title from '@components/Title';
import { fetchData } from '@services/utils/fetch';
import { API } from '@services/utils/path';
import { getQueryClient } from '@utils/query/queryClient';

import ProductInfo from './ProductInfo';

import type { ProductDetailVO, ProductVO } from '@api/product/types/vo';

const ProductDetail = async ({ params }: { params: { slug: string } }) => {
  const id = params.slug as string;

  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['products', { scope: 'item' }, id],
      queryFn: () => fetchData<ProductDetailVO>(API.PRODUCT.DETAIL(id), 'GET'),
    }),
    queryClient.prefetchQuery({
      queryKey: ['products', { status: 'top-views' }],
      queryFn: () => fetchData<ProductVO[]>(API.PRODUCT.TOP_VIEWS, 'GET'),
    }),
  ]);

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

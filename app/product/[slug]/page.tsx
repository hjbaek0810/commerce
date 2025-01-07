import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { headers } from 'next/headers';
import { getServerSession } from 'next-auth/next';

import Title from '@components/Title';
import { productKeys } from '@services/queries/product/keys';
import { getProductDetailQueryOptions } from '@services/queries/product/options';
import { getWishListQueryOptions } from '@services/queries/wish-list/options';
import { NOT_FOUND_IMAGE } from '@utils/constants/image';
import { getQueryClient } from '@utils/query/queryClient';

import ProductInfo from './ProductInfo';

import type { ProductDetailVO } from '@api/product/types/vo';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const id = params.slug;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(getProductDetailQueryOptions(id));

  const productData = queryClient.getQueryData<ProductDetailVO>(
    productKeys.getDetail(id),
  );
  const { name, description, images } = productData || {};

  return {
    title: `${name || '상품 상세'} | MiniMall`,
    description: description || 'MiniMall에서 다양한 상품을 만나보세요!',
    openGraph: {
      title: `${name || '상품 상세'} | MiniMall`,
      description: description || 'MiniMall에서 원하는 상품을 찾아보세요!',
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/product/${id}`,
      images: [
        {
          url: images?.[0]?.publicId || NOT_FOUND_IMAGE,
          alt: `${name || '상품'} 이미지`,
        },
      ],
    },
  };
}

const ProductDetail = async ({ params }: { params: { slug: string } }) => {
  const id = params.slug as string;

  const queryClient = getQueryClient();

  const session = await getServerSession();
  const isAuthenticated = !!session;

  const queries = [queryClient.prefetchQuery(getProductDetailQueryOptions(id))];

  if (isAuthenticated) {
    queries.push(queryClient.prefetchQuery(getWishListQueryOptions(headers())));
  }

  await Promise.all(queries);

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

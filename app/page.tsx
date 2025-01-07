import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import ProductSliderView from '@app/ProductSliderView';
import Outlet from '@components/Layout/Outlet';
import { getSortedProductListQueryOptions } from '@services/queries/product/options';
import { ProductSortType } from '@utils/constants/product';
import { getQueryClient } from '@utils/query/queryClient';

import Banner from './Banner';

export const metadata = {
  title: '최신 인기 상품과 신상품 | MiniMall',
  description:
    'MiniMall에서 최신 인기 상품과 신상품을 확인하세요! 특별 할인과 새로운 컬렉션으로 쇼핑을 즐겨보세요.',
  keywords: '인기 상품, 신상품, 할인, 쇼핑몰, MiniMall',
  openGraph: {
    url: process.env.NEXT_PUBLIC_BASE_URL,
    title: '최신 인기 상품과 신상품 | MiniMall',
    description:
      'MiniMall에서 최신 인기 상품과 신상품을 확인하세요! 특별 할인과 새로운 컬렉션으로 쇼핑을 즐겨보세요.',
  },
};

const Home = async () => {
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery(
      getSortedProductListQueryOptions(ProductSortType.NEWEST),
    ),
    queryClient.prefetchQuery(
      getSortedProductListQueryOptions(ProductSortType.POPULARITY),
    ),
  ]);

  return (
    <>
      <article>
        <Banner />
      </article>
      <Outlet isPadded>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ProductSliderView />
        </HydrationBoundary>
      </Outlet>
    </>
  );
};

export default Home;

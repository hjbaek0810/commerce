import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import ProductSliderView from '@app/ProductSliderView';
import Outlet from '@components/Layout/Outlet';
import { getSortedProductListQueryOptions } from '@services/queries/product/options';
import { ProductSortType } from '@utils/constants/product';
import { getQueryClient } from '@utils/query/queryClient';

import Banner from './sections/Banner';

const Home = async () => {
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.fetchQuery(
      getSortedProductListQueryOptions(ProductSortType.NEWEST),
    ),
    queryClient.fetchQuery(
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

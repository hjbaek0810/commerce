'use client';

import ProductSlider from '@app/ProductSlider';
import { useSortedProductListQueries } from '@services/queries/product';

const ProductSliderView = () => {
  const { newProducts, popularProducts } = useSortedProductListQueries();

  return (
    <>
      <ProductSlider
        title="New"
        subTitle="따끈따끈 최신 상품"
        products={newProducts?.data || []}
      />
      <ProductSlider
        title="Daily Best"
        subTitle="가장 사랑받는 실시간 베스트"
        products={popularProducts?.data || []}
      />
    </>
  );
};

export default ProductSliderView;

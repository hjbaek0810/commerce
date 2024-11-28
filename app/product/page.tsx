import { Suspense } from 'react';

import Title from '@components/Title';
import Loading from 'app/product/loading';

import ProductListTable from './ProductListTable';

const ProductList = () => {
  return (
    <>
      <Title>상품 목록</Title>
      <Suspense fallback={<Loading />}>
        <ProductListTable />
      </Suspense>
    </>
  );
};

export default ProductList;

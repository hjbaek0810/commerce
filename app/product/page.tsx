import { Suspense } from 'react';

import LoadingSpinner from '@components/Loading';
import Title from '@components/Title';

import ProductListTable from './ProductListTable';

const ProductList = () => {
  return (
    <>
      <Title>상품 목록</Title>
      <Suspense fallback={<LoadingSpinner />}>
        <ProductListTable />
      </Suspense>
    </>
  );
};

export default ProductList;

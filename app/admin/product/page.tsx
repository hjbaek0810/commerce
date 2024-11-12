import dynamic from 'next/dynamic';

import Title from '@components/Title';


const List = dynamic(() => import('./ProductList'), {
  ssr: false,
  loading: () => <div>로딩 중...</div>,
});

const ProductList = () => {
  // TODO: 필터 검색 기능
  return (
    <>
      <Title>상품 목록</Title>
      <List />
    </>
  );
};

export default ProductList;

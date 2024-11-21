'use client';

import { useProductListInfiniteQuery } from '@services/queries/product';

// import * as css from './product.css';

const Product = () => {
  const { products } = useProductListInfiniteQuery();

  return (
    <div>
      <h1>product list</h1>
      {products.map((item, index) => (
        <div key={item._id}>{item.name}</div>
      ))}
    </div>
  );
};

export default Product;

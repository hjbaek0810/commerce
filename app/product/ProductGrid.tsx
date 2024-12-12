'use client';

import { isEmpty } from 'lodash-es';

import Rhf from '@components/Form';
import LoadingSpinner from '@components/Loading';
import ProductCard from '@components/ProductCard';
import { ProductSortType } from '@utils/constants/product';

import * as css from './product.css';
import useProductGrid from './useProductGrid';

const ProductGrid = () => {
  const {
    keyword,
    products,
    productsUseForm,
    handleSortChange,
    productDetailQuery,
    isSoldOut,
    setTarget,
    isFetchingNextPage,
  } = useProductGrid();

  return (
    <>
      {/* search filter */}
      <Rhf.Form {...productsUseForm} className={css.searchForm}>
        <Rhf.Input name="name" placeholder="Please enter the product name." />

        <Rhf.Select name="sort" onChange={handleSortChange} hiddenPlaceholder>
          <Rhf.SelectOption value={ProductSortType.NEWEST}>
            최신 순
          </Rhf.SelectOption>
          <Rhf.SelectOption value={ProductSortType.OLDEST}>
            오래된 순
          </Rhf.SelectOption>
          <Rhf.SelectOption value={ProductSortType.POPULARITY}>
            인기 순
          </Rhf.SelectOption>
          <Rhf.SelectOption value={ProductSortType.PRICE_HIGH}>
            가격 높은 순
          </Rhf.SelectOption>
          <Rhf.SelectOption value={ProductSortType.PRICE_LOW}>
            가격 낮은 순
          </Rhf.SelectOption>
        </Rhf.Select>
      </Rhf.Form>

      {isEmpty(products) ? (
        <p className={css.notFoundProduct}>
          {keyword ? '검색 결과를 찾을 수 없습니다.' : '상품 준비 중입니다.'}
        </p>
      ) : (
        <ProductCard.Group>
          {products.map(({ _id, images, name, price, salePrice, status }) => (
            <ProductCard.Item key={_id} productId={_id} {...productDetailQuery}>
              <ProductCard.Image
                src={images?.[0]?.secureUrl}
                alt={name}
                className={isSoldOut(status) ? css.soldOutImage : undefined}
              >
                {isSoldOut(status) && (
                  <span className={css.soldOutImageText}>SOLD OUT</span>
                )}
              </ProductCard.Image>
              <ProductCard.Title>{name}</ProductCard.Title>
              <ProductCard.Price price={price} salePrice={salePrice} />
            </ProductCard.Item>
          ))}
        </ProductCard.Group>
      )}
      <div ref={setTarget}>
        {isFetchingNextPage ? <LoadingSpinner /> : null}
      </div>
    </>
  );
};

export default ProductGrid;

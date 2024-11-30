'use client';

import { isEmpty } from 'lodash-es';
import Image from 'next/image';
import Link from 'next/link';

import Rhf from '@components/Form';
import { ProductSortType } from '@utils/constants/product';
import { formatNumber } from '@utils/formatter/number';
import { calculateSaleRate } from '@utils/math/rate';
import { PATH } from '@utils/path';
import useProductListTable from 'app/product/useProductListTable';

import * as css from './product.css';

const ProductListTable = () => {
  const { products, productsUseForm, handleSortChange, productDetailQuery } =
    useProductListTable();

  return (
    <>
      {/* search filter */}
      <Rhf.Form {...productsUseForm} className={css.searchForm}>
        <Rhf.Input name="name" placeholder="Please enter the product name." />

        <Rhf.Select name="sort" onChange={handleSortChange}>
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
        <p className={css.notFoundProduct}>Product does not exist</p>
      ) : (
        <div className={css.productWrapper}>
          {products.map(({ _id, images, name, price, salePrice }) => (
            <Link
              className={css.productItem}
              key={_id}
              href={{
                pathname: PATH.PRODUCT.DETAIL(_id),
                query: productDetailQuery,
              }}
            >
              <figure className={css.productImageWrapper}>
                <Image
                  src={
                    images?.[0]?.secureUrl ??
                    'https://placehold.co/200x300/png?text=X'
                  }
                  alt={name}
                  fill
                  priority
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                  className={css.productImage}
                />
              </figure>

              <p className={css.productName}>{name}</p>

              <div className={css.productPriceWrapper}>
                <span className={css.price({ hasDiscount: !!salePrice })}>
                  {formatNumber(price)}
                </span>
                {!!salePrice && (
                  <>
                    <span className={css.saleRate}>
                      {calculateSaleRate(price, salePrice)}
                    </span>
                    <span className={css.price({ hasDiscount: false })}>
                      {formatNumber(salePrice)}
                    </span>
                  </>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default ProductListTable;

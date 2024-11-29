'use client';

import { isEmpty } from 'lodash-es';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { useProductListInfiniteQuery } from '@services/queries/product';
import { formatNumber } from '@utils/formatter/number';
import { calculateSaleRate } from '@utils/math/rate';
import { PATH } from '@utils/path';

import * as css from './product.css';

const ProductListTable = () => {
  const { products } = useProductListInfiniteQuery();
  const searchParams = useSearchParams();

  if (isEmpty(products))
    return <p className={css.notFoundProduct}>Product does not exist</p>;

  return (
    <div className={css.productWrapper}>
      {/* 상품 사진 여러개 등록가능한데 첫번째 사진을 보여줄지? 대표사진 설정기능을 추가할지. */}

      {products.map(({ _id, images, name, price, salePrice }) => (
        <Link
          className={css.productItem}
          key={_id}
          href={`${PATH.PRODUCT.DETAIL(_id)}?${searchParams.toString()}`}
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
  );
};

export default ProductListTable;

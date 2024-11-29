'use client';

import { faCartShopping, faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';

import Button from '@components/Button';
import { useProductDetailWithTopViews } from '@services/queries/product';
import { formatNumber } from '@utils/formatter/number';
import { calculateSaleRate } from '@utils/math/rate';

import * as css from './productDetail.css';

const ProductInfo = ({ id }: { id: string }) => {
  const { data: product } = useProductDetailWithTopViews(id);

  return (
    <div className={css.infoWrapper}>
      <figure className={css.imageWrapper}>
        <Image
          src={
            product?.images?.[0]?.secureUrl ??
            'https://placehold.co/200x300/png?text=X'
          }
          alt={product?.name ?? ''}
          fill
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          style={{
            objectFit: 'cover',
          }}
        />
      </figure>

      <div className={css.infoText}>
        <p className={css.productName}>{product?.name}</p>
        {product?.price && (
          <div className={css.productPriceWrapper}>
            <span
              className={css.price({
                hasDiscount: !!product?.salePrice,
              })}
            >
              {formatNumber(product?.price)}
            </span>
            {!!product?.salePrice && (
              <>
                <span className={css.saleRate}>
                  {calculateSaleRate(product.price, product.salePrice)}
                </span>
                <span className={css.price({ hasDiscount: false })}>
                  {formatNumber(product.salePrice)}
                </span>
              </>
            )}
          </div>
        )}
        {product?.isTop10 && <span className={css.bestBadge}>BEST</span>}

        <div className={css.productDesc}>{product?.description}</div>

        <div className={css.buttonWrapper}>
          <Button size="large" fill fullWidth>
            구매하기
          </Button>
          <Button size="medium">
            <FontAwesomeIcon className={css.cartIcon} icon={faCartShopping} />
          </Button>
          <Button size="medium">
            <FontAwesomeIcon className={css.likeIcon} icon={faHeart} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;

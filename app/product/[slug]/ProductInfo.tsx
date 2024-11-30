'use client';

import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import {
  faCartShopping,
  faHeart as faHeartSolid,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isNil } from 'lodash-es';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import Button from '@components/Button';
import { useProductDetailQuery } from '@services/queries/product';
import { useWishListMutation } from '@services/queries/wish-list';
import { formatNumber } from '@utils/formatter/number';
import { calculateSaleRate } from '@utils/math/rate';
import { PATH } from '@utils/path';

import * as css from './productDetail.css';

const ProductInfo = ({ id }: { id: string }) => {
  const { data: product, isTop10, isWished } = useProductDetailQuery(id);
  const { name, images, price, salePrice, description } = product || {};

  const { mutate: updateWish } = useWishListMutation();

  const router = useRouter();

  const handleWishButtonClick = () => {
    if (isNil(isWished)) router.push(PATH.WISH_LIST);

    updateWish({ productId: id });
  };

  return (
    <div className={css.infoWrapper}>
      <figure className={css.imageWrapper}>
        <Image
          src={
            images?.[0]?.secureUrl ?? 'https://placehold.co/200x300/png?text=X'
          }
          alt={name ?? ''}
          fill
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          style={{
            objectFit: 'cover',
          }}
        />
      </figure>

      <div className={css.infoText}>
        <p className={css.productName}>{name}</p>
        {price && (
          <div className={css.productPriceWrapper}>
            <span
              className={css.price({
                hasDiscount: !!salePrice,
              })}
            >
              {formatNumber(price)}
            </span>
            {salePrice && (
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
        )}
        {isTop10 && <span className={css.bestBadge}>BEST</span>}

        <div className={css.productDesc}>{description}</div>

        <div className={css.buttonWrapper}>
          <Button size="large" fill fullWidth>
            구매하기
          </Button>
          <Button size="medium">
            <FontAwesomeIcon className={css.cartIcon} icon={faCartShopping} />
          </Button>
          <Button size="medium" onClick={handleWishButtonClick}>
            <FontAwesomeIcon
              className={css.likeIcon}
              icon={isWished ? faHeartSolid : faHeartRegular}
            />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;

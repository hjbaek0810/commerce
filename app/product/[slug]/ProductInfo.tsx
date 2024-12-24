'use client';

import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import {
  faCartShopping,
  faHeart as faHeartSolid,
  faMinus,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';

import useProductInfo from '@app/product/[slug]/useProductInfo';
import Button from '@components/Button';
import { sprinkles } from '@styles/sprinkles.css';
import { NOT_FOUND_IMAGE } from '@utils/constants/image';
import { formatNumber } from '@utils/formatter/number';
import { calculateSaleRate } from '@utils/math/rate';
import { PATH } from '@utils/path';

import * as css from './productDetail.css';

const ProductInfo = ({ id }: { id: string }) => {
  const {
    product,
    isWished,
    minusQuantityButtonDisabled,
    addQuantityButtonDisabled,
    soldOut,
    quantity: addedQuantity,
    showRemainingQuantity,
    handleWishButtonClick,
    handleCartButtonClick,
    handleAddQuantityClick,
    handleMinusQuantityClick,
  } = useProductInfo(id);
  const { name, images, price, salePrice, description, quantity } =
    product || {};

  return (
    <div className={css.infoWrapper}>
      <figure className={css.imageWrapper}>
        <Image
          src={images?.[0]?.secureUrl ?? NOT_FOUND_IMAGE}
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

        <div
          className={sprinkles({
            width: 'sizing-half',
          })}
        >
          <div className={css.quantityWrapper}>
            <button
              type="button"
              className={css.quantityButton}
              disabled={minusQuantityButtonDisabled}
              onClick={handleMinusQuantityClick}
            >
              <FontAwesomeIcon icon={faMinus} className={css.quantityIcon} />
            </button>
            <span className={css.quantity}>{formatNumber(addedQuantity)}</span>
            <button
              type="button"
              className={css.quantityButton}
              disabled={addQuantityButtonDisabled}
              onClick={handleAddQuantityClick}
            >
              <FontAwesomeIcon icon={faPlus} className={css.quantityIcon} />
            </button>
          </div>
          {showRemainingQuantity && (
            <span
              className={css.remainingQuantity}
            >{`서두르세요! 남은 수량: ${quantity}`}</span>
          )}
        </div>

        {description && <div className={css.productDesc}>{description}</div>}

        <div className={css.buttonWrapper}>
          <Button
            size="large"
            fill
            fullWidth
            disabled={soldOut}
            href={{
              pathname: PATH.NEW_ORDER,
              query: {
                productId: id,
                quantity: addedQuantity,
                fromCart: false,
              },
            }}
          >
            {soldOut ? 'SOLD OUT' : '구매하기'}
          </Button>
          <Button
            size="medium"
            onClick={handleCartButtonClick}
            disabled={soldOut}
          >
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

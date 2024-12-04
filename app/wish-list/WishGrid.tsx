'use client';

import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isEmpty } from 'lodash-es';

import Button from '@components/Button';
import ProductCard from '@components/ProductCard';
import Title from '@components/Title';
import useWishList from 'app/wish-list/useWishList';

import * as css from './wishList.css';

const WishGrid = () => {
  const {
    wishList,
    productDetailQuery,
    handleGoToProductButtonClick,
    handleDeleteWishButtonClick,
  } = useWishList();

  if (isEmpty(wishList))
    return (
      <div className={css.emptyWishListWrapper}>
        <div className={css.emptyWishList}>
          <FontAwesomeIcon className={css.emptyHeartIcon} icon={faHeartSolid} />
          <p className={css.emptyText}>찜한 목록이 비어있습니다.</p>
          <Button size="large" fill onClick={handleGoToProductButtonClick}>
            상품 구경하기
          </Button>
        </div>
      </div>
    );

  return (
    <>
      <Title>찜한 목록</Title>
      <ProductCard.Group>
        {wishList.map(({ _id, images, name, price, salePrice }) => (
          <ProductCard.Item key={_id} productId={_id} {...productDetailQuery}>
            <ProductCard.Image src={images?.[0]?.secureUrl} alt={name}>
              <button
                className={css.likeButton}
                onClick={e => handleDeleteWishButtonClick(_id, e)}
              >
                <FontAwesomeIcon className={css.likeIcon} icon={faHeartSolid} />
              </button>
            </ProductCard.Image>

            <ProductCard.Title>{name}</ProductCard.Title>
            <ProductCard.Price price={price} salePrice={salePrice} />
          </ProductCard.Item>
        ))}
      </ProductCard.Group>
    </>
  );
};

export default WishGrid;

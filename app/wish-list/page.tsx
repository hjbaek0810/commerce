'use client';

import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ProductCard from '@components/ProductCard';
import Title from '@components/Title';
import useWishList from 'app/wish-list/useWishList';

import * as css from './wishList.css';

const WishList = () => {
  const { wishList, productDetailQuery, handleDeleteWishButtonClick } =
    useWishList();

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

export default WishList;

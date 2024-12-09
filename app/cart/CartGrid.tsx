'use client';

import {
  faCartShopping,
  faMinus,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isEmpty } from 'lodash-es';
import Image from 'next/image';
import Link from 'next/link';

import useCartGrid from '@app/cart/useCartGrid';
import * as productDetailCss from '@app/product/[slug]/productDetail.css';
import Button from '@components/Button';
import Rhf from '@components/Form';
import { Table } from '@components/Table';
import { formatNumber } from '@utils/formatter/number';
import { PATH } from '@utils/path';

import * as css from './cart.css';

const CartGrid = () => {
  const {
    isEmptyCartList,
    cartList,
    cartForm,
    checkedCarts,
    selectedCartItems,
    calculatePrice,
    calculateTotalPrice,
    showRemainingQuantity,
    handleAddQuantityClick,
    handleMinusQuantityClick,
    handleDeleteCartList,
    handleGoToWishListButtonClick,
    handleGoToProductDetailButtonClick,
  } = useCartGrid();

  if (isEmptyCartList)
    return (
      <div className={css.emptyCartListWrapper}>
        <div className={css.emptyCartList}>
          <FontAwesomeIcon
            className={css.emptyCartIcon}
            icon={faCartShopping}
          />
          <p className={css.emptyText}>장바구니 목록이 비어있습니다.</p>
          <Button size="large" fill onClick={handleGoToWishListButtonClick}>
            찜한 상품 보기
          </Button>
        </div>
      </div>
    );

  return (
    <Rhf.Form
      {...cartForm}
      onSubmit={handleDeleteCartList}
      className={css.cartGrid}
    >
      <div className={css.deleteButtonWrapper}>
        <Button size="small" type="submit">
          선택 삭제
        </Button>
      </div>
      <Table>
        <Rhf.CheckboxGroup
          options={cartList.map(({ product }) => product._id)}
          name="productIds"
        >
          <Table.Header>
            <Table.Tr>
              <Table.Th width="sizing-056">
                <Rhf.Checkbox partiallyChecked />
              </Table.Th>
              <Table.Th />
              <Table.Th>상품명</Table.Th>
              <Table.Th>수량</Table.Th>
              <Table.Th>가격</Table.Th>
            </Table.Tr>
          </Table.Header>
          <Table.Body>
            {cartList.map(({ product, quantity }) => (
              <Table.Tr
                key={product._id}
                onClick={() => handleGoToProductDetailButtonClick(product._id)}
              >
                <Table.Td>
                  <Rhf.Checkbox
                    value={product._id}
                    onChange={e => e.stopPropagation()}
                  />
                </Table.Td>
                <Table.Td>
                  <figure className={css.imageWrapper}>
                    <Image
                      src={
                        product?.images?.[0]?.secureUrl ||
                        'https://placehold.co/200x300/png?text=X'
                      }
                      alt={product.name}
                      fill
                      priority
                      sizes="15vw"
                      style={{
                        objectFit: 'cover',
                      }}
                    />
                  </figure>
                </Table.Td>
                <Table.Td>{product.name}</Table.Td>
                <Table.Td>
                  <div className={productDetailCss.quantityWrapper}>
                    <button
                      className={productDetailCss.quantityButton}
                      disabled={quantity === 1}
                      onClick={e => handleMinusQuantityClick(product._id, e)}
                    >
                      <FontAwesomeIcon
                        icon={faMinus}
                        className={productDetailCss.quantityIcon}
                      />
                    </button>
                    <span className={productDetailCss.quantity}>
                      {formatNumber(quantity)}
                    </span>
                    <button
                      className={productDetailCss.quantityButton}
                      onClick={e => handleAddQuantityClick(product._id, e)}
                      disabled={product.quantity <= quantity}
                    >
                      <FontAwesomeIcon
                        icon={faPlus}
                        className={productDetailCss.quantityIcon}
                      />
                    </button>
                  </div>
                  {showRemainingQuantity(product.quantity) && (
                    <span
                      className={productDetailCss.remainingQuantity}
                    >{`서두르세요! 남은 수량: ${product.quantity}`}</span>
                  )}
                </Table.Td>
                <Table.Td>
                  {formatNumber(
                    calculatePrice(product.price, product.salePrice, quantity),
                  )}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Body>
        </Rhf.CheckboxGroup>
      </Table>

      <div className={css.buyButtonWrapper}>
        <Button
          size="large"
          fill
          disabled={isEmpty(checkedCarts)}
          href={{
            pathname: PATH.NEW_ORDER,
            query: { fromCart: true, productId: checkedCarts },
          }}
        >
          {`${formatNumber(
            calculateTotalPrice(
              selectedCartItems.map(({ product }) => product),
              selectedCartItems.map(({ quantity }) => quantity),
            ),
          )}원(${checkedCarts.length}) 구매하기`}
        </Button>
      </div>
    </Rhf.Form>
  );
};

export default CartGrid;

'use client';

import {
  faCartShopping,
  faMinus,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isEmpty } from 'lodash-es';
import Image from 'next/image';

import useCartGrid from '@app/cart/useCartGrid';
import * as productDetailCss from '@app/product/[slug]/productDetail.css';
import Button from '@components/Button';
import Rhf from '@components/Form';
import { Table } from '@components/Table';
import { NOT_FOUND_IMAGE } from '@utils/constants/image';
import { formatNumber } from '@utils/formatter/number';
import { calculatePrice, calculateTotalPrice } from '@utils/math/price';
import { PATH } from '@utils/path';

import * as css from './cart.css';

const CartGrid = () => {
  const {
    isEmptyCartList,
    cartList,
    cartForm,
    selectedCartIds,
    selectedCartItems,
    isSoldOut,
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
                      src={product?.images?.[0]?.secureUrl || NOT_FOUND_IMAGE}
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
                  <div
                    className={productDetailCss.quantityWrapper}
                    onClick={e => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      className={productDetailCss.quantityButton}
                      disabled={quantity === 1}
                      onClick={() => handleMinusQuantityClick(product._id)}
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
                      type="button"
                      className={productDetailCss.quantityButton}
                      onClick={() => handleAddQuantityClick(product._id)}
                      disabled={product.quantity <= quantity}
                    >
                      <FontAwesomeIcon
                        icon={faPlus}
                        className={productDetailCss.quantityIcon}
                      />
                    </button>
                  </div>
                  {showRemainingQuantity(product.quantity, product.status) && (
                    <span
                      className={productDetailCss.remainingQuantity}
                    >{`서두르세요! 남은 수량: ${product.quantity}`}</span>
                  )}
                  {isSoldOut(product.status) && (
                    <span className={css.soldOutText}>
                      SOLD OUT - 현재 해당 상품은 주문 불가능합니다.
                    </span>
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
          disabled={isEmpty(selectedCartIds)}
          href={{
            pathname: PATH.NEW_ORDER,
            query: { fromCart: true, productId: selectedCartIds },
          }}
        >
          {`${formatNumber(
            calculateTotalPrice(
              selectedCartItems.map(({ product }) => product.price),
              selectedCartItems.map(({ product }) => product.salePrice),
              selectedCartItems.map(({ quantity }) => quantity),
            ),
          )}원(${selectedCartIds.length}) 구매하기`}
        </Button>
      </div>
    </Rhf.Form>
  );
};

export default CartGrid;

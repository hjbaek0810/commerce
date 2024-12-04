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
import { formatNumber } from '@utils/formatter/number';

import * as css from './cart.css';

const CartGrid = () => {
  const {
    isEmptyCartList,
    cartList,
    cartForm,
    quantity,
    minusQuantityButtonDisabled,
    handleAddQuantityClick,
    handleMinusQuantityClick,
    handleGoToWishListButtonClick,
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
      onSubmit={data => {
        console.log(data);
      }}
      className={css.cartGrid}
    >
      <div className={css.deleteButtonWrapper}>
        <Button size="small">선택 삭제</Button>
      </div>
      <Table>
        <Rhf.CheckboxGroup options={['childA']} name="selected">
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
            <Table.Tr
              onClick={() => {
                // TODO: 상세 페이지 이동
              }}
            >
              <Table.Td>
                <Rhf.Checkbox value="childA" />
              </Table.Td>
              <Table.Td>
                <figure className={css.imageWrapper}>
                  <Image
                    src="https://placehold.co/200x300/png?text=X"
                    alt="name"
                    fill
                    priority
                    sizes="15vw"
                    style={{
                      objectFit: 'cover',
                    }}
                  />
                </figure>
              </Table.Td>
              <Table.Td>name</Table.Td>
              <Table.Td>
                <div className={productDetailCss.quantityWrapper}>
                  <button
                    className={productDetailCss.quantityButton}
                    disabled={minusQuantityButtonDisabled}
                    onClick={handleMinusQuantityClick}
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
                    onClick={handleAddQuantityClick}
                  >
                    <FontAwesomeIcon
                      icon={faPlus}
                      className={productDetailCss.quantityIcon}
                    />
                  </button>
                </div>
              </Table.Td>
              <Table.Td>3000</Table.Td>
            </Table.Tr>
          </Table.Body>
        </Rhf.CheckboxGroup>
      </Table>

      {/* TODO: 선택 항목 가격 total */}
      <div className={css.buyButtonWrapper}>
        <Button type="submit" size="large" fill>
          1,000원 구매하기(n)
        </Button>
      </div>
    </Rhf.Form>
  );
};

export default CartGrid;

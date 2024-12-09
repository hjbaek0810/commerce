'use client';

import Image from 'next/image';

import useNewOrder from '@app/new-order/useNewOrder';
import Button from '@components/Button';
import Rhf from '@components/Form';
import { Table } from '@components/Table';
import Title from '@components/Title';
import { formatNumber } from '@utils/formatter/number';
import { telephoneRules } from '@utils/validation';
import { PHONE_MAX_LENGTH } from '@utils/validation/telephone';

import * as css from './newOrder.css';

const NewOrder = () => {
  const {
    newOrderList,
    orderForm,
    calculatePrice,
    calculateTotalPrice,
    handleFindPostCodeButtonClick,
    handleTelephoneInput,
  } = useNewOrder();

  return (
    <>
      <Title>ORDER</Title>
      <Rhf.Form className={css.orderWrapper} {...orderForm}>
        <Table>
          <Table.Header>
            <Table.Tr>
              <Table.Th />
              <Table.Th>상품명</Table.Th>
              <Table.Th>수량</Table.Th>
              <Table.Th>가격</Table.Th>
            </Table.Tr>
          </Table.Header>
          <Table.Body>
            {newOrderList?.items.map(({ product, quantity }) => (
              <Table.Tr key={product._id}>
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
                <Table.Td>{formatNumber(quantity)}</Table.Td>
                <Table.Td>
                  {formatNumber(
                    calculatePrice(product.price, product.salePrice, quantity),
                  )}
                </Table.Td>
              </Table.Tr>
            ))}
            {newOrderList?.items && (
              <Table.Tr>
                <Table.Td colSpan={4}>
                  <span className={css.totalPrice}>
                    {`Total: ${formatNumber(
                      calculateTotalPrice(
                        newOrderList.items.map(({ product }) => product),
                        newOrderList.items.map(({ quantity }) => quantity),
                      ),
                    )}`}
                  </span>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Body>
        </Table>

        <Table>
          <Table.Body>
            <Table.Tr>
              <Table.Th scope="row">
                <Rhf.Label name="postCode" required>
                  주소
                </Rhf.Label>
              </Table.Th>
              <Table.Td colSpan={2}>
                <div className={css.addressWrapper}>
                  <div className={css.postCodeWrapper}>
                    <Rhf.Input
                      name="postCode"
                      placeholder="우편번호"
                      readOnly
                      required
                    />
                    <Button onClick={handleFindPostCodeButtonClick}>
                      주소 찾기
                    </Button>
                  </div>
                  <Rhf.Input
                    name="address"
                    placeholder="주소"
                    readOnly
                    required
                  />
                  <Rhf.Input
                    name="subAddress"
                    placeholder="상세주소"
                    required
                  />
                </div>
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th scope="row">
                <Rhf.Label name="telephone" required>
                  연락처
                </Rhf.Label>
              </Table.Th>
              <Table.Td colSpan={2}>
                <Rhf.Input
                  type="tel"
                  name="telephone"
                  placeholder="e.g. 010-1234-5678"
                  onInput={handleTelephoneInput}
                  maxLength={PHONE_MAX_LENGTH}
                  rules={telephoneRules}
                />
              </Table.Td>
            </Table.Tr>
          </Table.Body>
        </Table>

        <div className={css.orderButtonWrapper}>
          <Button size="large" fill type="submit">
            주문하기
          </Button>
        </div>
      </Rhf.Form>
    </>
  );
};

export default NewOrder;

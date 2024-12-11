'use client';

import type { PropsWithChildren } from 'react';

import Image from 'next/image';

import useAdminOrderDetail from '@app/admin/order/[slug]/useAdminOrderDetail';
import Button from '@components/Button';
import Rhf from '@components/Form';
import Radio from '@components/Form/Radio';
import OrderStatusBadge from '@components/OrderStatusBadge';
import { Table } from '@components/Table';
import Title from '@components/Title';
import { OrderStatus, PaymentType } from '@utils/constants/order';
import { formatDateTime } from '@utils/formatter/datetime';
import { formatNumber } from '@utils/formatter/number';

import * as css from './adminOrderDetail.css';

const OrderInfoBox = ({
  label,
  children,
}: PropsWithChildren<{ label: string }>) => {
  return (
    <div className={css.orderInfoBox}>
      <span>{label}</span>
      <span className={css.orderInfoValue}>{children}</span>
    </div>
  );
};
const AdminOrderDetail = () => {
  const { adminOrderUseForm, data } = useAdminOrderDetail();
  const {
    _id,
    userId,
    userName,
    createdAt,
    items,
    totalPrice,
    postCode,
    address,
    subAddress,
    paymentType,
    telephone,
    status,
  } = data || {};

  return (
    <>
      <Title>주문 관리</Title>
      <div className={css.orderWrapper}>
        <div className={css.orderManageWrapper}>
          <div className={css.orderInfoWrapper}>
            <div className={css.orderInfoBoxWrapper}>
              <OrderInfoBox label="주문 번호">{_id}</OrderInfoBox>
              <OrderInfoBox label="주문자 번호">{userId}</OrderInfoBox>
              <OrderInfoBox label="주문자">{userName}</OrderInfoBox>
              <OrderInfoBox label="주문일시">
                {formatDateTime(createdAt)}
              </OrderInfoBox>
            </div>
          </div>

          <Rhf.Form className={css.orderStatusWrapper} {...adminOrderUseForm}>
            <OrderStatusBadge
              status={status || OrderStatus.PAYMENT_PENDING}
              size="large"
              full
            />
            <Rhf.Radio className={css.orderStatusRadioWrapper} name="status">
              <Rhf.RadioOption value="a">a</Rhf.RadioOption>
              <Rhf.RadioOption value="b">b</Rhf.RadioOption>
              <Rhf.RadioOption value="c">c</Rhf.RadioOption>
            </Rhf.Radio>

            <Button size="medium">제출</Button>
          </Rhf.Form>
        </div>

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
            {items?.map(({ product, quantity, price }) => (
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
                <Table.Td>{formatNumber(price)}</Table.Td>
              </Table.Tr>
            ))}

            <Table.Tr>
              <Table.Td colSpan={4}>
                <span className={css.totalPrice}>
                  {`Total: ${formatNumber(totalPrice)}`}
                </span>
              </Table.Td>
            </Table.Tr>
          </Table.Body>
        </Table>

        <Table>
          <Table.Body>
            <Table.Tr>
              <Table.Th scope="row">주소</Table.Th>
              <Table.Td colSpan={2}>
                <div className={css.addressWrapper}>
                  <span>{postCode}</span>
                  <span>{address}</span>
                  <span>{subAddress}</span>
                </div>
                주소
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th scope="row">연락처</Table.Th>
              <Table.Td colSpan={2}>{telephone}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th scope="row">결제 방법</Table.Th>
              <Table.Td colSpan={2}>
                <div className={css.paymentTypeWrapper}>
                  <Radio
                    value={PaymentType.BANK_TRANSFER}
                    checked={paymentType === PaymentType.BANK_TRANSFER}
                    disabled
                  >
                    무통장 입금
                  </Radio>
                  <Radio
                    value={PaymentType.CARD}
                    checked={paymentType === PaymentType.CARD}
                    disabled
                  >
                    카드 (준비중)
                  </Radio>
                </div>
              </Table.Td>
            </Table.Tr>
          </Table.Body>
        </Table>
      </div>
    </>
  );
};

export default AdminOrderDetail;

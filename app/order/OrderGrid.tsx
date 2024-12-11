'use client';

import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';

import useOrderGrid from '@app/order/useOrderGrid';
import Button from '@components/Button';
import Radio from '@components/Form/Radio';
import { Table } from '@components/Table';
import Title from '@components/Title';
import {
  OrderStatus,
  PaymentType,
  getOrderStatusText,
} from '@utils/constants/order';
import { formatNumber } from '@utils/formatter/number';
import { calculatePrice } from '@utils/math/price';

import * as css from './order.css';

// const UserButton = ({ status }: { status: OrderStatus }) => {
//   const renderButton = () => {
//     switch (status) {
//       // 결제 대기, 결제 완료
//       case OrderStatus.PAYMENT_PENDING:
//       case OrderStatus.PAYMENT_COMPLETED:
//         return <Button>취소 요청</Button>; // -> REFUND_PENDING 환불 대기
//       // 배송 대기, 배송 진행, 배송 완료
//       case OrderStatus.SHIPPING_PENDING:
//       case OrderStatus.SHIPPING_IN_PROGRESS:
//       case OrderStatus.SHIPPING_COMPLETED:
//         return <Button>반품 요청</Button>; // -> RETURN_PENDING 반품 대기
//       default:
//         return null;
//     }
//   };

//   return renderButton();
// };

const OrderGrid = () => {
  const {
    orderInfo,
    isEmptyOrderList,
    renderButton,
    handleGoToCartListButtonClick,
    handleGoToProductDetailButton,
  } = useOrderGrid();

  if (isEmptyOrderList)
    return (
      <div className={css.emptyOrderListWrapper}>
        <div className={css.emptyOrderList}>
          <FontAwesomeIcon
            className={css.emptyCartIcon}
            icon={faCartShopping}
          />
          <p className={css.emptyText}>주문 목록이 비어있습니다.</p>
          <Button size="large" fill onClick={handleGoToCartListButtonClick}>
            장바구니 보기
          </Button>
        </div>
      </div>
    );

  return (
    <>
      <Title>ORDER</Title>

      <div className={css.orderWrapper}>
        {orderInfo.map(
          ({
            _id,
            items,
            totalPrice,
            postCode,
            address,
            subAddress,
            telephone,
            paymentType,
            status,
          }) => (
            <div key={_id} className={css.orderItemWrapper}>
              <div className={css.orderProductWrapper}>
                <div className={css.orderInfoWrapper}>
                  <Title size="medium">주문번호: {_id}</Title>
                  <span className={css.statusBadge({ status })}>
                    {getOrderStatusText(status)}
                  </span>
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
                    {items.map(({ product, quantity, price }) => (
                      <Table.Tr
                        key={product._id}
                        onClick={() =>
                          handleGoToProductDetailButton(product._id)
                        }
                      >
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
                          {formatNumber(calculatePrice(price, null, quantity))}
                        </Table.Td>
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
              </div>

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
              {renderButton(_id, status) && (
                <div className={css.userButtonWrapper}>
                  {renderButton(_id, status)}
                </div>
              )}
            </div>
          ),
        )}
      </div>
    </>
  );
};

export default OrderGrid;
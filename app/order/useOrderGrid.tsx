import { isEmpty } from 'lodash-es';
import { useRouter } from 'next/navigation';

import Button from '@components/Button';
import {
  useOrderListInfiniteQuery,
  useOrderStatusMutation,
} from '@services/queries/order';
import { OrderStatus } from '@utils/constants/order';
import { PATH } from '@utils/path';

const useOrderGrid = () => {
  // TODO: 무한 스크롤
  const {
    orders: orderInfo,
    fetchNextPage,
    isFetchingNextPage,
  } = useOrderListInfiniteQuery();

  const { mutate: updateOrderStatus } = useOrderStatusMutation();
  const router = useRouter();

  const handleGoToCartListButtonClick = () => router.push(PATH.CART);
  const handleGoToProductDetailButton = (id: string) =>
    router.push(PATH.PRODUCT.DETAIL(id));

  const handleRequestStatusButton = (orderId: string, status: OrderStatus) => {
    updateOrderStatus({
      _id: orderId,
      status,
    });
  };

  const renderButton = (orderId: string, status: OrderStatus) => {
    switch (status) {
      // 결제 대기
      case OrderStatus.PAYMENT_PENDING:
        return (
          <Button
            size="large"
            fill
            onClick={() =>
              handleRequestStatusButton(orderId, OrderStatus.ORDER_CANCELLED)
            }
          >
            취소 요청
          </Button>
        );
      // 결제 완료
      case OrderStatus.PAYMENT_COMPLETED:
        return (
          <Button
            size="large"
            fill
            onClick={() =>
              handleRequestStatusButton(orderId, OrderStatus.REFUND_PENDING)
            }
          >
            환불 요청
          </Button>
        );
      // 배송 대기, 배송 진행, 배송 완료
      case OrderStatus.SHIPPING_PENDING:
      case OrderStatus.SHIPPING_IN_PROGRESS:
      case OrderStatus.SHIPPING_COMPLETED:
        return (
          <Button
            size="large"
            fill
            onClick={() =>
              handleRequestStatusButton(orderId, OrderStatus.RETURN_PENDING)
            }
          >
            반품 요청
          </Button>
        );
      default:
        return null;
    }
  };

  return {
    orderInfo: orderInfo || [],
    isEmptyOrderList: orderInfo && isEmpty(orderInfo),
    renderButton,
    handleGoToCartListButtonClick,
    handleGoToProductDetailButton,
  };
};

export default useOrderGrid;

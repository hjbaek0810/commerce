import { isEmpty } from 'lodash-es';
import { useRouter } from 'next/navigation';

import Button from '@components/Button';
import {
  useOrderListQuery,
  useOrderStatusMutation,
} from '@services/queries/order';
import { OrderStatus } from '@utils/constants/order';
import { PATH } from '@utils/path';

const useOrderGrid = () => {
  const { data: orderInfo } = useOrderListQuery();

  const { mutate: updateOrderStatus } = useOrderStatusMutation();
  const router = useRouter();

  const handleGoToCartListButtonClick = () => router.push(PATH.CART);
  const handleGoToProductDetailButton = (id: string) =>
    router.push(PATH.PRODUCT.DETAIL(id));

  const handleRequestCancel = (orderId: string) => {
    updateOrderStatus({
      _id: orderId,
      status: OrderStatus.REFUND_PENDING, // 환불 대기
    });
  };

  const handleRequestReturn = (orderId: string) => {
    updateOrderStatus({
      _id: orderId,
      status: OrderStatus.RETURN_PENDING, // 반품 대기
    });
  };

  const renderButton = (orderId: string, status: OrderStatus) => {
    switch (status) {
      // 결제 대기, 결제 완료
      case OrderStatus.PAYMENT_PENDING:
      case OrderStatus.PAYMENT_COMPLETED:
        return (
          <Button
            size="large"
            fill
            onClick={() => handleRequestCancel(orderId)}
          >
            취소 요청
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
            onClick={() => handleRequestReturn(orderId)}
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
    isEmptyOrderList:
      orderInfo && isEmpty(orderInfo?.map(order => order.items)),
    renderButton,
    handleGoToCartListButtonClick,
    handleGoToProductDetailButton,
  };
};

export default useOrderGrid;

import { useQueryClient } from '@tanstack/react-query';
import { isEmpty } from 'lodash-es';
import { useRouter } from 'next/navigation';

import Button from '@components/Button';
import {
  useOrderListInfiniteQuery,
  useOrderStatusMutation,
} from '@services/queries/order';
import { orderKeys } from '@services/queries/order/keys';
import { OrderStatus } from '@utils/constants/order';
import useIntersectionObserver from '@utils/hooks/useIntersectionObserver';
import { PATH } from '@utils/path';

import type { OrderVO } from '@api/order/types/vo';

const useOrderGrid = () => {
  const queryClient = useQueryClient();
  const {
    orders: orderInfo,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useOrderListInfiniteQuery();

  const { setTarget } = useIntersectionObserver({
    hasNextPage,
    fetchNextPage,
  });

  const { mutate: updateOrderStatus } = useOrderStatusMutation();
  const router = useRouter();

  const handleGoToCartListButtonClick = () => router.push(PATH.CART);
  const handleGoToProductDetailButton = (id: string) =>
    router.push(PATH.PRODUCT.DETAIL(id));

  const handleRequestStatusButton = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(
      {
        _id: orderId,
        status,
        productIds: orderInfo
          .filter(item => item._id === orderId)
          .flatMap(({ items }) => items.map(({ product }) => product._id)),
      },
      {
        onSuccess: () => {
          queryClient.setQueryData<OrderVO[]>(orderKeys.getAll(), previous => {
            if (!previous) return orderInfo;

            const updatedData = previous.map(item =>
              item._id === orderId ? { ...item, status } : item,
            );

            return updatedData;
          });
        },
      },
    );
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
      // 재구매
      case OrderStatus.ORDER_CANCELLED:
        return (
          <Button
            size="large"
            fill
            onClick={() =>
              handleRequestStatusButton(orderId, OrderStatus.PAYMENT_PENDING)
            }
          >
            재구매
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
    setTarget,
    isFetchingNextPage,
    handleGoToCartListButtonClick,
    handleGoToProductDetailButton,
  };
};

export default useOrderGrid;

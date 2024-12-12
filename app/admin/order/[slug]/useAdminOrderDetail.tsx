import { useForm } from 'react-hook-form';

import { useParams, useRouter } from 'next/navigation';

import Rhf from '@components/Form';
import {
  useAdminOrderDetailQuery,
  useAdminOrderStatusMutation,
} from '@services/queries/order';
import { OrderStatus } from '@utils/constants/order';
import { PATH } from '@utils/path';

import type { UpdateAdminOrder } from '@api/admin/order/types/dto';

type AdminOrderStatusUseForm = Pick<UpdateAdminOrder, 'status'>;

const useAdminOrderDetail = () => {
  const params = useParams();
  const id = params.slug as string;
  const router = useRouter();

  const { data: orderInfo } = useAdminOrderDetailQuery(id);
  const { mutate: updateOrderStatus } = useAdminOrderStatusMutation();

  const adminOrderUseForm = useForm<AdminOrderStatusUseForm>({
    values: {
      status: orderInfo?.status || OrderStatus.PAYMENT_PENDING,
    },
  });

  const getRadioOptions = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PAYMENT_PENDING:
        return (
          <Rhf.RadioOption value={OrderStatus.PAYMENT_COMPLETED}>
            결제 확인
          </Rhf.RadioOption>
        );
      case OrderStatus.PAYMENT_COMPLETED:
      case OrderStatus.SHIPPING_PENDING:
      case OrderStatus.SHIPPING_IN_PROGRESS:
        return (
          <>
            <Rhf.RadioOption value={OrderStatus.SHIPPING_PENDING}>
              배송 대기
            </Rhf.RadioOption>
            <Rhf.RadioOption value={OrderStatus.SHIPPING_IN_PROGRESS}>
              배송 진행 중
            </Rhf.RadioOption>
            <Rhf.RadioOption value={OrderStatus.SHIPPING_COMPLETED}>
              배송 완료
            </Rhf.RadioOption>
          </>
        );
      case OrderStatus.REFUND_PENDING:
        return (
          <Rhf.RadioOption value={OrderStatus.REFUND_COMPLETED}>
            환불 승인
          </Rhf.RadioOption>
        );
      case OrderStatus.RETURN_PENDING:
        return (
          <Rhf.RadioOption value={OrderStatus.RETURN_COMPLETED}>
            반품 승인
          </Rhf.RadioOption>
        );
      default:
        return null;
    }
  };

  const handleGoToProductDetail = (id: string) => {
    router.push(PATH.ADMIN.PRODUCT.DETAIL(id));
  };

  const handleOrderStatusUpdate = (data: AdminOrderStatusUseForm) => {
    if (id && data.status !== orderInfo?.status) {
      updateOrderStatus({
        _id: id,
        ...data,
      });
    }
  };

  return {
    adminOrderUseForm,
    orderInfo,
    getRadioOptions,
    handleGoToProductDetail,
    handleOrderStatusUpdate,
  };
};

export default useAdminOrderDetail;

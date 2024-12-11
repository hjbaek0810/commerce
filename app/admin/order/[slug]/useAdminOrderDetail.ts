import { useForm } from 'react-hook-form';

import { useParams } from 'next/navigation';

import { useAdminOrderDetailQuery } from '@services/queries/order';
import { OrderStatus } from '@utils/constants/order';

const useAdminOrderDetail = () => {
  const params = useParams();
  const id = params.slug as string;

  const { data } = useAdminOrderDetailQuery(id);

  const adminOrderUseForm = useForm({
    values: {
      status: data?.status || OrderStatus.PAYMENT_PENDING,
    },
  });

  return { adminOrderUseForm, data };
};

export default useAdminOrderDetail;

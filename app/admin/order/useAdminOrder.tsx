import { useForm } from 'react-hook-form';

import { useRouter, useSearchParams } from 'next/navigation';

import { useAdminOrderListQuery } from '@services/queries/order';
import {
  OrderSortType,
  OrderStatus,
  getOrderStatusText,
} from '@utils/constants/order';
import { PATH } from '@utils/path';

import type { SearchAdminOrder } from '@api/admin/order/types/dto';

const orderStatusOptions = [
  OrderStatus.ORDER_CANCELLED,
  OrderStatus.PAYMENT_COMPLETED,
  OrderStatus.PAYMENT_PENDING,
  OrderStatus.REFUND_COMPLETED,
  OrderStatus.REFUND_PENDING,
  OrderStatus.RETURN_COMPLETED,
  OrderStatus.RETURN_PENDING,
  OrderStatus.SHIPPING_COMPLETED,
  OrderStatus.SHIPPING_IN_PROGRESS,
  OrderStatus.SHIPPING_PENDING,
];

const useAdminOrder = () => {
  const router = useRouter();

  const {
    data: orderList,
    paginationProps,
    handleSearchParamsChange,
  } = useAdminOrderListQuery();

  const searchParams = useSearchParams();

  const searchOrderForm = useForm<SearchAdminOrder>({
    values: {
      _id: searchParams.get('_id') || '',
      userId: searchParams.get('userId') || '',
      username: searchParams.get('username') || '',
      status: (searchParams.get('status') as OrderStatus) || '',
      sort: (searchParams.get('sort') as OrderSortType) || OrderSortType.NEWEST,
    },
  });

  const handleSearchOrder = (data: SearchAdminOrder) => {
    handleSearchParamsChange(data);
  };

  const handleSortChange = () => {
    const sort = searchOrderForm.getValues('sort');

    handleSearchParamsChange({ sort });
  };

  const getOrderStatusOptions = orderStatusOptions.map(status => {
    return {
      name: getOrderStatusText(status),
      value: status,
    };
  });

  const handleFilterResetButtonClick = () => {
    searchOrderForm.reset();

    handleSearchParamsChange({
      _id: '',
      userId: '',
      username: '',
      status: '',
      sort: OrderSortType.NEWEST,
    });
  };

  const handleGoToOrderDetail = (id: string) =>
    router.push(PATH.ADMIN.ORDER.DETAIL(id));

  return {
    orderList,
    paginationProps,
    searchOrderForm,
    getOrderStatusOptions,
    handleSearchOrder,
    handleSortChange,
    handleFilterResetButtonClick,
    handleGoToOrderDetail,
  };
};

export default useAdminOrder;

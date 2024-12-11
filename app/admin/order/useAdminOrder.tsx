import { useForm } from 'react-hook-form';

import { useSearchParams } from 'next/navigation';

import { useAdminOrderListQuery } from '@services/queries/order';
import {
  OrderSortType,
  OrderStatus,
  getOrderStatusText,
} from '@utils/constants/order';

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
      userName: searchParams.get('userName') || '',
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
      userName: '',
      status: '',
      sort: OrderSortType.NEWEST,
    });
  };

  return {
    orderList,
    paginationProps,
    searchOrderForm,
    getOrderStatusOptions,
    handleSearchOrder,
    handleSortChange,
    handleFilterResetButtonClick,
  };
};

export default useAdminOrder;

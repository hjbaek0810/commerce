import { getOrderStatusText } from '@utils/constants/order';

import * as css from './orderStatusBadge.css';

import type { OrderStatusBadgeVariants } from './orderStatusBadge.css';
import type { OrderStatus } from '@utils/constants/order';

type OrderStatusBadgePropsType = {
  status: OrderStatus;
} & OrderStatusBadgeVariants;

const OrderStatusBadge = ({
  status,
  size,
  full,
}: OrderStatusBadgePropsType) => {
  return (
    <span className={css.statusBadge({ status, size, full })}>
      {getOrderStatusText(status)}
    </span>
  );
};

export default OrderStatusBadge;

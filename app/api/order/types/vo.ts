import type { ProductVO } from '@api/product/types/vo';
import type { OrderStatus, PaymentType } from '@utils/constants/order';

export type OrderProductVO = Pick<ProductVO, '_id' | 'name' | 'images'>;

export interface OrderListVO {
  _id: string;
  userId: string;
  userName: string;
  items: Array<{
    product: OrderProductVO;
    quantity: number;
    price: number;
  }>;
  address: string;
  postCode: string;
  subAddress: string;
  telephone: string;
  status: OrderStatus;
  paymentType: PaymentType;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

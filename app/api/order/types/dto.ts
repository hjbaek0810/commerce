import type { OrderStatus, PaymentType } from '@utils/constants/order';

export type CreateOrder = {
  products: Array<{
    _id: string;
    quantity: number;
    price: number;
  }>;
  address: string;
  postCode: string;
  subAddress: string;
  telephone: string;
  status: OrderStatus;
  paymentType: PaymentType;
  fromCart?: boolean;
};

export type UpdateOrder = {
  _id: string;
  status: OrderStatus;
  paymentType?: PaymentType;
};

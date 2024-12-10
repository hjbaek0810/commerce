export enum OrderStatus {
  ORDER_CANCELLED = 'ORDER_CANCELLED',
  // ORDER_PENDING = 'ORDER_PENDING',
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  PAYMENT_COMPLETED = 'PAYMENT_COMPLETED',
  SHIPPING_PENDING = 'SHIPPING_PENDING',
  SHIPPING_IN_PROGRESS = 'SHIPPING_IN_PROGRESS',
  SHIPPING_COMPLETED = 'SHIPPING_COMPLETED',
  REFUND_PENDING = 'REFUND_PENDING',
  REFUND_COMPLETED = 'REFUND_COMPLETED',
  RETURN_PENDING = 'RETURN_PENDING',
  RETURN_COMPLETED = 'RETURN_COMPLETED',
}

export enum PaymentType {
  BANK_TRANSFER = 'BANK_TRANSFER',
  CARD = 'CARD',
}

export const getOrderStatusText = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.ORDER_CANCELLED:
      return '주문 취소';
    // case OrderStatus.ORDER_PENDING:
    //   return '주문 대기';
    case OrderStatus.PAYMENT_PENDING:
      return '결제 대기';
    case OrderStatus.PAYMENT_COMPLETED:
      return '결제 완료';
    case OrderStatus.SHIPPING_PENDING:
      return '배송 대기';
    case OrderStatus.SHIPPING_IN_PROGRESS:
      return '배송 진행 중';
    case OrderStatus.SHIPPING_COMPLETED:
      return '배송 완료';
    case OrderStatus.REFUND_PENDING:
      return '환불 대기';
    case OrderStatus.REFUND_COMPLETED:
      return '환불 완료';
    case OrderStatus.RETURN_PENDING:
      return '반품 대기';
    case OrderStatus.RETURN_COMPLETED:
      return '반품 완료';
    default:
      return '';
  }
};

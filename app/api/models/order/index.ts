import { Schema, model, models } from 'mongoose';

const OrderItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
});

const OrderSchema = new Schema(
  {
    productIds: {
      type: [OrderItemSchema],
    },
    userId: {
      type: String,
      required: true,
    },
    telephone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    postCode: {
      type: String,
      required: true,
    },
    subAddress: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: [
        'ORDER_CANCELLED',
        // 'ORDER_PENDING',
        'PAYMENT_PENDING',
        'PAYMENT_COMPLETED',
        'SHIPPING_PENDING',
        'SHIPPING_IN_PROGRESS',
        'SHIPPING_COMPLETED',
        'REFUND_PENDING',
        'REFUND_COMPLETED',
        'RETURN_PENDING',
        'RETURN_COMPLETED',
      ],
      required: true,
      default: 'PAYMENT_PENDING',
    },
    paymentType: {
      type: String,
      enum: ['BANK_TRANSFER', 'CARD'],
      required: true,
      default: 'BANK_TRANSFER',
    },
  },
  { timestamps: true },
);

const OrderModel = models.Order || model('Order', OrderSchema);

export default OrderModel;

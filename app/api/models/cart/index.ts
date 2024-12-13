import { Schema, model, models } from 'mongoose';

import type { ProductModelType } from '@api/models/product';
import type { InferSchemaType } from 'mongoose';

const CartItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  addedAt: { type: Date, default: Date.now },
});

const CartSchema = new Schema(
  {
    productIds: {
      type: [CartItemSchema],
      default: [],
    },
  },
  { timestamps: true },
);

const CartModel = models.Cart || model('Cart', CartSchema);

export type CartModelType = InferSchemaType<typeof CartSchema> & {
  _id: string;
  productIds: {
    productId: ProductModelType;
    quantity: number;
    addedAt: string;
  }[];
};

export default CartModel;

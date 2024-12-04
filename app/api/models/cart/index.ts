import { Schema, model, models } from 'mongoose';

const CartItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
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

export default CartModel;

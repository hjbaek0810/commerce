import { Schema, model, models } from 'mongoose';

const WishListSchema = new Schema(
  {
    productIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  { timestamps: true },
);

const WishListModel = models.WishList || model('WishList', WishListSchema);

export default WishListModel;

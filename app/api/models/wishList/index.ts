import { Schema, model, models } from 'mongoose';

import type { ProductModelType } from '@api/models/product';
import type { InferSchemaType } from 'mongoose';

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

export type WishListModelType = InferSchemaType<typeof WishListSchema> & {
  _id: string;
  productIds: ProductModelType[];
};

export default WishListModel;

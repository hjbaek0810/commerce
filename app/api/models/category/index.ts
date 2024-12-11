import { Schema, model, models } from 'mongoose';

import type { SubCategoryModelType } from '@api/models/subCategory';
import type { InferSchemaType } from 'mongoose';

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    subCategories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'SubCategory',
      },
    ],
  },
  { timestamps: true },
);

const CategoryModel = models.Category || model('Category', CategorySchema);

export type CategoryModelType = InferSchemaType<typeof CategorySchema> & {
  _id: string;
  subCategories: SubCategoryModelType[];
};

export default CategoryModel;

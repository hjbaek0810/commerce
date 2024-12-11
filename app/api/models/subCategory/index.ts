import { Schema, model, models } from 'mongoose';

import type { CategoryModelType } from '@api/models/category';
import type { InferSchemaType } from 'mongoose';

const SubCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
  },
  { timestamps: true },
);

const SubCategoryModel =
  models.SubCategory || model('SubCategory', SubCategorySchema);

export type SubCategoryModelType = InferSchemaType<typeof SubCategorySchema> & {
  _id: string;
  categoryId: CategoryModelType;
};

export default SubCategoryModel;

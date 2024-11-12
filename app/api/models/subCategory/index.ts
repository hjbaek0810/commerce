import { Schema, model, models } from 'mongoose';

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

export default SubCategoryModel;

import { Schema, model, models } from 'mongoose';

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
    },
    subCategory: {
      type: Array<string>,
    },
  },
  { timestamps: true },
);

const CategoryModel = models.category || model('category', CategorySchema);

export default CategoryModel;

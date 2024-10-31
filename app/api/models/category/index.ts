import { Schema, model, models } from 'mongoose';

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    subCategory: [
      {
        name: { required: true, type: String },
      },
    ],
  },
  { timestamps: true },
);

const CategoryModel = models.Category || model('Category', CategorySchema);

export default CategoryModel;

import { Schema, model, models } from 'mongoose';

const CategorySchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
    },
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

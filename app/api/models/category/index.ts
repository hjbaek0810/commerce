import { Schema, model, models } from 'mongoose';

const CategorySchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
    },
    name: {
      type: String,
      unique: true,
      required: true,
    },
    subCategory: {
      type: [String],
    },
  },
  { timestamps: true },
);

const CategoryModel = models.category || model('category', CategorySchema);

export default CategoryModel;

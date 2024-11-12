import { Schema, model, models } from 'mongoose';

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

export default CategoryModel;

import { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    quantity: {
      type: Number,
    },
    price: {
      type: Number,
      required: true,
    },
    salePrice: {
      type: Number,
    },
    categoryName: {
      type: String,
    },
    status: {
      type: String,
      enum: ['IN_PROGRESS', 'STOPPED', 'PENDING'],
      required: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true },
);

const ProductModel = models.Product || model('Product', ProductSchema);

export default ProductModel;

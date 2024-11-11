import { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    salePrice: {
      type: Number,
    },
    categoryId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['IN_PROGRESS', 'STOPPED', 'PENDING'],
      required: true,
    },
    description: {
      type: String,
    },
    images: [
      {
        publicId: {
          type: String,
          required: true,
        },
        secureUrl: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true },
);

const ProductModel = models.Product || model('Product', ProductSchema);

export default ProductModel;

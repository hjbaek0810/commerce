import { Schema, model, models } from 'mongoose';

import type { CategoryModelType } from '@api/models/category';
import type { SubCategoryModelType } from '@api/models/subCategory';
import type { InferSchemaType } from 'mongoose';

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
    categoryIds: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
      },
      subCategoryId: {
        type: Schema.Types.ObjectId,
        ref: 'SubCategory',
      },
    },
    status: {
      type: String,
      enum: ['IN_PROGRESS', 'STOPPED', 'PENDING', 'HIDDEN'],
      required: true,
    },
    description: {
      type: String,
    },
    images: [
      {
        name: {
          type: String,
        },
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
    views: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const ProductModel = models.Product || model('Product', ProductSchema);

export type ProductModelType = InferSchemaType<typeof ProductSchema> & {
  _id: string;
  categoryIds: {
    _id: CategoryModelType;
    subCategoryId: SubCategoryModelType;
  };
};

export default ProductModel;

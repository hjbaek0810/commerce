import type { ProductStatusType } from '@api/utils/types/status';

export type CreateProduct = {
  name: string;
  quantity: number;
  price: number;
  salePrice: number | null;
  categoryIds: {
    _id: string;
    subCategoryId?: string;
  };
  status: ProductStatusType;
  images?: Array<{
    name: string;
    publicId: string;
    secureUrl: string;
  }>;
  description?: string;
};

export type UpdateProduct = CreateProduct & {
  _id: string;
  deleteImageIds?: string[];
};

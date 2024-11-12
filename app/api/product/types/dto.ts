import type { ProductStatusType } from '@api/utils/types/enum';

export type CreateProduct = {
  name: string;
  price: number;
  salePrice?: number;
  categoryIds: {
    _id: string;
    subCategoryId?: string;
  };
  status: ProductStatusType;
  images?: Array<{
    publicId: string;
    secureUrl: string;
  }>;
};

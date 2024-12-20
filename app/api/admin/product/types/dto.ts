import type {
  ProductSortType,
  ProductStatusType,
} from '@utils/constants/product';

export type SearchAdminProduct = {
  category?: string;
  subCategory?: string;
  name?: string;
  status?: ProductStatusType;
  sort?: ProductSortType;
};

export type CreateAdminProduct = {
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

export type UpdateAdminProduct = CreateAdminProduct & {
  _id: string;
  deleteImageIds?: string[];
};

import type { ProductStatusType } from '@utils/constants/product';

export interface ImageVO {
  _id: string;
  publicId: string;
  secureUrl: string;
  name: string;
}

export interface ProductVO {
  _id: string;
  name: string;
  quantity: number;
  price: number;
  salePrice: number | null;
  category: {
    _id: string;
    name: string;
    subCategory: {
      _id: string;
      name: string;
    };
  };
  status: ProductStatusType;
  description: string;
  images: Array<ImageVO>;
  createdAt: string;
}

export interface ProductDetailVO extends Omit<ProductVO, 'category'> {
  categoryIds: {
    _id: string;
    subCategoryId?: string;
  };
  views: number;
}

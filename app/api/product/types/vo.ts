import type { ProductStatusType } from '@api/utils/types/enum';

export interface ImageVO {
  _id: string;
  publicId: string;
  secureUrl: string;
}

export interface ProductVO {
  _id: string;
  name: string;
  quantity: number;
  price: number;
  salePrice: number | null;
  categoryName: string;
  status: ProductStatusType;
  description: string | null;
  images: Array<ImageVO>;
}

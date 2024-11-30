import type { ProductVO } from '@api/product/types/vo';

export interface WishListVO {
  _id: string;
  items: Array<ProductVO>;
}

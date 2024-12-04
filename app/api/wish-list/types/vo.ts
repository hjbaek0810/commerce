import type { ProductVO } from '@api/product/types/vo';

export type WishListProductVO = Pick<
  ProductVO,
  '_id' | 'name' | 'images' | 'price' | 'salePrice'
>;

export interface WishListVO {
  _id: string;
  items: Array<WishListProductVO>;
}

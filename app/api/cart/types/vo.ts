import type { ProductVO } from '@api/product/types/vo';

export type CartProductVO = Pick<
  ProductVO,
  '_id' | 'name' | 'images' | 'price' | 'salePrice' | 'quantity'
>;

export interface CartListVO {
  _id: string;
  items: Array<{
    product: CartProductVO;
    quantity: number;
  }>;
}

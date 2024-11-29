import type { ProductSortType } from '@utils/constants/product';

export type SearchProduct = {
  name?: string;
  sort?: ProductSortType;
};

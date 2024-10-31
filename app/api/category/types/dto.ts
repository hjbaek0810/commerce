import type { SubCategoryVO } from './vo';

export type CreateCategory = {
  _id?: string;
  name: string;
  subCategory: Array<SubCategoryVO>;
};

export interface SubCategoryVO {
  _id: string;
  name: string;
}

export interface CategoryVO {
  _id: string;
  name: string;
  subCategory: Array<SubCategoryVO>;
}

export interface AdminSubCategoryVO {
  _id: string;
  name: string;
  deletable: boolean;
}

export interface AdminCategoryVO {
  _id: string;
  name: string;
  subCategories: Array<AdminSubCategoryVO>;
  deletable: boolean;
}

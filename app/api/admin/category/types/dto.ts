type AdminSubCategories = {
  _id?: string;
  name: string;
  deletable?: boolean;
};

export type AdminCreateCategory = {
  _id?: string;
  name: string;
  subCategories: Array<AdminSubCategories>;
  deletable?: boolean;
};

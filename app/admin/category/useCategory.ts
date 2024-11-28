import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import { isEmpty } from 'lodash-es';

import {
  useAdminCategoriesMutation,
  useAdminCategoriesQuery,
} from '@services/queries/category';

import type { AdminCreateCategory } from '@api/admin/category/types/dto';

export type CategoryUseFormType = {
  categories: Array<AdminCreateCategory>;
};

const defaultValues: AdminCreateCategory = {
  _id: '',
  name: '',
  subCategories: [],
};

const useCategory = () => {
  const { data: categories, isPending } = useAdminCategoriesQuery();

  const [editable, setEditable] = useState<boolean>(false);
  const { mutate: updateCategories } = useAdminCategoriesMutation();

  const categoryForm = useForm<CategoryUseFormType>({
    values: {
      categories: isEmpty(categories) ? [defaultValues] : categories,
    },
  });

  const { fields, remove, append } = useFieldArray({
    name: 'categories',
    control: categoryForm.control,
  });

  const handleEditClick = () => {
    setEditable(true);
  };

  const handleCancelClick = () => {
    setEditable(false);
    categoryForm.reset({
      categories,
    });
  };

  const handleSaveSubmit = (data: CategoryUseFormType) => {
    updateCategories(data.categories, {
      onSuccess: () => setEditable(false),
    });
  };

  const handleCategoryAddClick = () => {
    append(defaultValues);
  };

  const handleCategoryDeleteClick = (index: number) => {
    remove(index);
  };

  return {
    categoryForm,
    fields,
    editable,
    isPending,
    handleCategoryAddClick,
    handleCategoryDeleteClick,
    handleEditClick,
    handleCancelClick,
    handleSaveSubmit,
  };
};

export default useCategory;

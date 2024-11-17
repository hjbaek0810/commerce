import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import { useCategoriesMutation, useCategoriesQuery } from '@queries/category';
import { isEmpty } from 'lodash-es';


import type { CreateCategory } from '@api/category/types/dto';

export type CategoryUseFormType = { categories: CreateCategory[] };

const defaultValues: CreateCategory = {
  _id: '',
  name: '',
  subCategories: [],
};

const useCategory = () => {
  const { data: categories } = useCategoriesQuery();

  const [editable, setEditable] = useState<boolean>(false);
  const { mutate: updateCategories } = useCategoriesMutation();

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
    handleCategoryAddClick,
    handleCategoryDeleteClick,
    handleEditClick,
    handleCancelClick,
    handleSaveSubmit,
  };
};

export default useCategory;

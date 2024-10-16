import { useCallback, useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import { fetchData } from '@api/utils/fetch';
import { API } from '@api/utils/path';

import type { CreateCategory } from '@api/category/type';

export type CategoryUseFormType = { categories: CreateCategory[] };

const defaultValues: CreateCategory = {
  _id: undefined,
  name: '',
  subCategory: [''],
};
const useCategory = () => {
  const [editable, setEditable] = useState<boolean>(false);
  const [category, setCategory] = useState<Array<CreateCategory>>();

  const categoryForm = useForm<CategoryUseFormType>({
    values: {
      categories: category ?? [defaultValues],
    },
  });

  const { fields, remove, append } = useFieldArray({
    name: 'categories',
    control: categoryForm.control,
  });

  const fetchCategory = useCallback(() => {
    fetchData<Array<CreateCategory>>(API.CATEGORY, 'GET').then(data =>
      setCategory(
        data.map(({ _id, name, subCategory }) => {
          return {
            _id,
            name,
            subCategory,
          };
        }),
      ),
    );
  }, []);

  useEffect(() => {
    fetchCategory();
  }, [fetchCategory]);

  const handleEditClick = () => {
    setEditable(true);
  };

  const handleCancelClick = () => {
    setEditable(false);
    categoryForm.reset({
      categories: category,
    });
  };

  const handleSaveSubmit = (data: CategoryUseFormType) => {
    fetchData<Array<CreateCategory>>(API.CATEGORY, 'PUT', {
      data: data.categories,
    }).then(() => {
      setEditable(false);
      fetchCategory();
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

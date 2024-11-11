import { useCallback, useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import { isEmpty } from 'lodash-es';

import { fetchData } from '@api/utils/fetch';
import { API } from '@api/utils/path';

import type { CreateCategory } from '@api/category/types/dto';
import type { CategoryVO } from '@api/category/types/vo';

export type CategoryUseFormType = { categories: CreateCategory[] };

const defaultValues: CreateCategory = {
  _id: '',
  name: '',
  subCategory: [],
};
const useCategory = () => {
  const [editable, setEditable] = useState<boolean>(false);
  const [categories, setCategories] = useState<Array<CreateCategory>>();

  const categoryForm = useForm<CategoryUseFormType>({
    values: {
      categories: categories || [defaultValues],
    },
  });

  const { fields, remove, append } = useFieldArray({
    name: 'categories',
    control: categoryForm.control,
  });

  const fetchCategory = useCallback(() => {
    fetchData<Array<CategoryVO>>(API.CATEGORY, 'GET').then(data =>
      setCategories(
        isEmpty(data)
          ? [defaultValues]
          : data.map(({ _id, name, subCategory }) => {
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
      categories,
    });
  };

  const handleSaveSubmit = (data: CategoryUseFormType) => {
    fetchData<Array<CategoryVO>>(API.CATEGORY, 'PUT', {
      data: data.categories.map(category => ({
        ...category,
        subCategory: category.subCategory?.filter(sub => sub.name?.length > 0),
      })),
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

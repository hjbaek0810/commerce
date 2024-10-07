import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import type { CreateCategory } from '@api/category/type';

const defaultValues = {
  name: '',
  subCategory: [''],
};
const useCategory = () => {
  const [editable, setEditable] = useState<boolean>(false);
  const [category, setCategory] = useState<Array<CreateCategory>>();

  const categoryForm = useForm({
    values: {
      categories: category ?? [defaultValues],
    },
  });

  const { fields, remove, append } = useFieldArray({
    name: 'categories',
    control: categoryForm.control,
  });

  useEffect(() => {
    fetch('/api/category', {
      method: 'GET',
    })
      .then(res => res.json() as Promise<Array<CreateCategory>>)
      .then(data =>
        setCategory(
          data.map(({ name, subCategory }) => {
            return {
              name,
              subCategory,
            };
          }),
        ),
      );
  }, []);

  const handleEditClick = () => {
    setEditable(true);
  };

  const handleCancelClick = () => {
    setEditable(false);
    categoryForm.reset({
      categories: category,
    });
  };

  const handleSaveClick = () => {
    setEditable(false);
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
    handleSaveClick,
  };
};

export default useCategory;

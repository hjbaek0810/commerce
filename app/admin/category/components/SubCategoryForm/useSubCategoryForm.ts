import { useFieldArray, useFormContext } from 'react-hook-form';

import type { CategoryUseFormType } from '../../useCategory';

const useSubCategoryForm = (nestIndex: number) => {
  const { control } = useFormContext<CategoryUseFormType>();
  const { fields, remove, append } = useFieldArray({
    control,
    name: `categories.${nestIndex}.subCategories`,
  });

  const handleSubCategoryItemDeleteClick = (index: number) => {
    remove(index);
  };

  const handleSubCategoryItemAddClick = () => {
    append({
      name: '',
    });
  };

  return {
    fields,
    handleSubCategoryItemDeleteClick,
    handleSubCategoryItemAddClick,
  };
};

export default useSubCategoryForm;

import { useFieldArray, useFormContext } from 'react-hook-form';

const useSubCategoryForm = (nestIndex: number) => {
  const { control } = useFormContext();
  const { fields, remove, append } = useFieldArray({
    control,
    name: `categories.${nestIndex}.subCategories`,
  });

  const handleSubCategoryItemDeleteClick = (index: number) => {
    remove(index);
  };

  const handleSubCategoryItemAddClick = () => {
    append('');
  };

  return {
    fields,
    handleSubCategoryItemDeleteClick,
    handleSubCategoryItemAddClick,
  };
};

export default useSubCategoryForm;

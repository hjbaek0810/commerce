import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Rhf from '@components/Form';

import useSubCategoryForm from './useSubCategoryForm';
import * as css from '../../category.css';

type SubCategoryFormPropsType = {
  nestIndex: number;
  editable: boolean;
};

const SubCategoryForm = ({ nestIndex, editable }: SubCategoryFormPropsType) => {
  const {
    fields,
    handleSubCategoryItemDeleteClick,
    handleSubCategoryItemAddClick,
  } = useSubCategoryForm(nestIndex);

  return (
    <div className={css.subCategoryForm}>
      {fields.map((item, index) => (
        <div key={item.id} className={css.subCategoryInputWrapper}>
          <Rhf.Input
            name={`categories.${nestIndex}.subCategory.${index}`}
            disabled={!editable}
          />
          <button
            type="button"
            className={css.removeButton({ show: editable })}
            onClick={() => handleSubCategoryItemDeleteClick(index)}
          >
            <FontAwesomeIcon icon={faXmark} className={css.buttonIcon} />
          </button>
        </div>
      ))}

      <button
        type="button"
        className={css.subCategoryItemAddButton({ show: editable })}
        onClick={handleSubCategoryItemAddClick}
      >
        <FontAwesomeIcon icon={faPlus} className={css.buttonIcon} />
      </button>
    </div>
  );
};

export default SubCategoryForm;

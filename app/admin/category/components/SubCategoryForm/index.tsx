import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Rhf from '@components/Form';
import { Table } from '@components/Table';

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
    <>
      <Table.Th scope="row">
        <Rhf.Label name={`categories.${nestIndex}.subCategories.0.name`}>
          하위 카테고리
        </Rhf.Label>
      </Table.Th>

      <Table.Td>
        <div className={css.subCategoryForm}>
          {fields.map((item, index) => (
            <div key={item.id} className={css.subCategoryInputWrapper}>
              {item.id && (
                <Rhf.Input
                  name={`categories.${nestIndex}.subCategories.${index}._id`}
                  hidden
                />
              )}
              <Rhf.Input
                name={`categories.${nestIndex}.subCategories.${index}.name`}
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

          {fields.length === 0 && (
            <input id={`categories.${nestIndex}.subCategories.0.name`} hidden />
          )}

          <button
            type="button"
            className={css.subCategoryItemAddButton({ show: editable })}
            onClick={handleSubCategoryItemAddClick}
          >
            <FontAwesomeIcon icon={faPlus} className={css.buttonIcon} />
          </button>
        </div>
      </Table.Td>
    </>
  );
};

export default SubCategoryForm;

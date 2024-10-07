'use client';

import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Rhf from '@components/Form';
import { Table } from '@components/Table';

import * as css from './category.css';
import SubCategoryForm from './sections/SubCategoryForm';
import useCategory from './useCategory';

const AdminCategory = () => {
  const {
    editable,
    categoryForm,
    fields,
    handleCategoryAddClick,
    handleCategoryDeleteClick,
    handleEditClick,
    handleCancelClick,
    handleSaveClick,
  } = useCategory();

  return (
    <div>
      <div>
        {editable ? (
          <>
            <button type="button" onClick={handleCancelClick}>
              Cancel
            </button>
            <button type="submit" onClick={handleSaveClick}>
              Save
            </button>
          </>
        ) : (
          <button type="button" onClick={handleEditClick}>
              Edit
            </button>
        )}
      </div>

      <Rhf.Form
        {...categoryForm}
        onSubmit={data => {
          console.log('submit', data);
        }}
      >
        <Table>
          <Table.Body>
            {fields.map((item, index) => (
              <Table.Tr key={item.id}>
                <Table.Th scope="row">
                  <Rhf.Label
                    name={`categories.${index}.name`}
                    required={editable}
                  >
                    카테고리
                  </Rhf.Label>
                </Table.Th>
                <Table.Td>
                  <Rhf.Input
                    name={`categories.${index}.name`}
                    required={editable}
                    disabled={!editable}
                  />
                </Table.Td>
                <Table.Th scope="row">
                  <Rhf.Label name="subCategory">하위 카테고리</Rhf.Label>
                </Table.Th>
                <Table.Td>
                  <SubCategoryForm nestIndex={index} editable={editable} />
                </Table.Td>
                <Table.Td
                  className={css.categoryItemRemoveButtonWrapper({
                    show: editable,
                  })}
                >
                  <button
                    className={css.categoryItemRemoveButton}
                    onClick={() => {
                      handleCategoryDeleteClick(index);
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faXmark}
                      className={css.buttonIcon}
                    />
                  </button>
                </Table.Td>
              </Table.Tr>
            ))}
            {editable && (
              <Table.Tr>
                <Table.Td
                  colSpan={5}
                  className={css.categoryItemAddButtonWrapper}
                >
                  <button
                    type="button"
                    className={css.categoryItemAddButton}
                    onClick={handleCategoryAddClick}
                  >
                    <FontAwesomeIcon icon={faPlus} className={css.buttonIcon} />
                  </button>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Body>
        </Table>
        <button
          type="submit"
          onClick={() => {
            console.log(categoryForm.getValues());
          }}
        >
          제출
        </button>
      </Rhf.Form>
    </div>
  );
};

export default AdminCategory;

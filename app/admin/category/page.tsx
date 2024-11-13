'use client';

import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from '@components/Button';
import Rhf from '@components/Form';
import { Table } from '@components/Table';
import Title from '@components/Title';

import * as css from './category.css';
import SubCategoryForm from './components/SubCategoryForm';
import useCategory from './useCategory';

import type { CategoryUseFormType } from './useCategory';

const AdminCategory = () => {
  const {
    editable,
    categoryForm,
    fields,
    handleCategoryAddClick,
    handleCategoryDeleteClick,
    handleEditClick,
    handleCancelClick,
    handleSaveSubmit,
  } = useCategory();

  return (
    <>
      <Title>Manage Categories</Title>
      <Rhf.Form {...categoryForm} onSubmit={handleSaveSubmit}>
        <div className={css.categoryForm}>
          <div className={css.categoryButtonWrapper}>
            {editable ? (
              <>
                <Button color="secondary" onClick={handleCancelClick}>
                  Cancel
                </Button>
                <Button fill type="submit">
                  Save
                </Button>
              </>
            ) : (
              <Button fill onClick={handleEditClick}>
                Edit
              </Button>
            )}
          </div>

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
                    {item.id && (
                      <Rhf.Input name={`categories.${index}._id`} hidden />
                    )}

                    <Rhf.Input<CategoryUseFormType>
                      name={`categories.${index}.name`}
                      required={editable}
                      disabled={!editable}
                      rules={{
                        validate: (value, { categories }) => {
                          const filteredNames = categories
                            .filter(category => category.name === value)
                            .map(category => category.name);

                          return filteredNames.length < 2;
                        },
                      }}
                    />
                  </Table.Td>

                  <SubCategoryForm nestIndex={index} editable={editable} />

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
                      disabled={fields.length === 1}
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
                      <FontAwesomeIcon
                        icon={faPlus}
                        className={css.buttonIcon}
                      />
                    </button>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Body>
          </Table>
        </div>
      </Rhf.Form>
    </>
  );
};

export default AdminCategory;

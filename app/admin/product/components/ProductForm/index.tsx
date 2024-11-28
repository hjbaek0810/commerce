import { faMinus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isEmpty } from 'lodash-es';
import Image from 'next/image';

import Button from '@components/Button';
import Rhf from '@components/Form';
import { Table } from '@components/Table';
import { ProductStatusType } from '@utils/constants/product';

import * as css from './productForm.css';
import useProductForm from './useProductForm';

import type { ProductUseFormType } from './useProductForm';
import type { ImageVO } from '@api/product/types/vo';

type ProductFormType = { savedImages?: Array<ImageVO>; editable?: boolean };

const ProductForm = ({ savedImages, editable = true }: ProductFormType) => {
  const {
    categories,
    subCategories,
    saleRate,
    selectedImages,
    validateSubCategory,
    validateImage,
    isImageToBeDeleted,
    handleCategoryRegisterButton,
    handleDeleteImageToggleButtonClick,
  } = useProductForm();

  return (
    <Table>
      <Table.Body>
        <Table.Tr>
          <Table.Th scope="row">
            <Rhf.Label name="name" required={editable}>
              상품명
            </Rhf.Label>
          </Table.Th>
          <Table.Td>
            {/* detail */}
            {savedImages && <Rhf.Input name="_id" hidden />}
            <Rhf.Input name="name" required={editable} disabled={!editable} />
          </Table.Td>
          <Table.Th scope="row">
            <Rhf.Label name="quantity" required={editable}>
              수량
            </Rhf.Label>
          </Table.Th>
          <Table.Td>
            <Rhf.Input
              type="number"
              name="quantity"
              required={editable}
              disabled={!editable}
              rules={{
                min: 0,
              }}
            />
          </Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th scope="row">
            <Rhf.Label name="price" required={editable}>
              가격
            </Rhf.Label>
          </Table.Th>
          <Table.Td>
            <Rhf.Input
              name="price"
              type="number"
              required={editable}
              disabled={!editable}
              rules={{
                min: 0,
              }}
            />
          </Table.Td>
          <Table.Th scope="row">
            <Rhf.Label name="salePrice">할인가</Rhf.Label>
          </Table.Th>
          <Table.Td>
            <div className={css.saleWrapper}>
              <Rhf.Input<ProductUseFormType>
                name="salePrice"
                type="number"
                rules={{
                  min: 0,
                  validate: (value, { price }) => {
                    if (Number(value) > Number(price))
                      return '원가보다 높을 수 없습니다.';
                  },
                }}
                disabled={!editable}
              />
              {!(!editable && !saleRate) && (
                <span className={css.calculatedSale}>{saleRate}%</span>
              )}
            </div>
            <Rhf.ErrorMessage name="salePrice" />
          </Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th scope="row">
            <Rhf.Label name="categoryId" required={editable}>
              카테고리
            </Rhf.Label>
          </Table.Th>
          <Table.Td>
            {isEmpty(categories) ? (
              <Button onClick={handleCategoryRegisterButton}>
                카테고리 등록하기
              </Button>
            ) : (
              <Rhf.Select
                name="categoryId"
                required={editable}
                disabled={!editable}
              >
                {categories?.map(({ _id, name }) => (
                  <Rhf.SelectOption key={_id} value={_id}>
                    {name}
                  </Rhf.SelectOption>
                ))}
              </Rhf.Select>
            )}
          </Table.Td>
          <Table.Td colSpan={2}>
            <Rhf.Radio
              name="subCategoryId"
              className={css.subCategoryRadioGroup}
              rules={{
                validate: validateSubCategory,
              }}
              disabled={!editable}
            >
              {subCategories?.map(sub => (
                <Rhf.RadioOption key={sub._id} value={sub._id}>
                  {sub.name}
                </Rhf.RadioOption>
              ))}
            </Rhf.Radio>
          </Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th scope="row">
            <Rhf.Label name="status">상품상태</Rhf.Label>
          </Table.Th>
          <Table.Td colSpan={3}>
            <Rhf.Radio
              name="status"
              className={css.subCategoryRadioGroup}
              required={editable}
              disabled={!editable}
            >
              <Rhf.RadioOption value={ProductStatusType.PENDING}>
                대기
              </Rhf.RadioOption>
              <Rhf.RadioOption value={ProductStatusType.IN_PROGRESS}>
                진행
              </Rhf.RadioOption>
              <Rhf.RadioOption value={ProductStatusType.STOPPED}>
                정지
              </Rhf.RadioOption>
            </Rhf.Radio>
          </Table.Td>
        </Table.Tr>
        {editable && (
          <Table.Tr>
            <Table.Th scope="row">
              <Rhf.Label name="images">이미지 첨부</Rhf.Label>
            </Table.Th>
            <Table.Td colSpan={3}>
              <p className={css.imageDesc}>이미지 10MB를 초과할 수 없습니다.</p>
              <Rhf.FileUpload
                name="images"
                multiple
                accept="image/*"
                rules={{
                  validate: validateImage,
                }}
              />
              {/* image preview */}
              {!isEmpty(selectedImages) && (
                <>
                  <p className={css.imagePreviewTitle}>preview</p>
                  <div className={css.imagePreviewWrapper}>
                    {selectedImages.map((file, index) => (
                      <Image
                        key={index}
                        className={css.imagePreview}
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        width={200}
                        height={150}
                      />
                    ))}
                  </div>
                </>
              )}
            </Table.Td>
          </Table.Tr>
        )}

        {/* (상세페이지) 저장된 이미지 show, delete */}
        {!isEmpty(savedImages) && (
          <Table.Tr>
            <Table.Th scope="row">
              <Rhf.Label name="images">기존 이미지</Rhf.Label>
            </Table.Th>
            <Table.Td colSpan={3}>
              <Rhf.Input name="deleteImageIds" hidden />
              <div className={css.deleteImageWrapper}>
                {savedImages?.map(({ _id, publicId, secureUrl, name }) => (
                  <button
                    key={_id}
                    type="button"
                    disabled={!editable}
                    className={css.deleteImageButton({
                      active: isImageToBeDeleted(publicId),
                    })}
                    onClick={() => handleDeleteImageToggleButtonClick(publicId)}
                  >
                    <Image
                      className={css.imagePreview}
                      src={secureUrl}
                      alt={name}
                      width={200}
                      height={150}
                      priority
                    />

                    {editable &&
                      (isImageToBeDeleted(publicId) ? (
                        <FontAwesomeIcon
                          icon={faMinus}
                          className={css.minusIcon}
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faTrash}
                          className={css.trashIcon}
                        />
                      ))}
                  </button>
                ))}
              </div>
            </Table.Td>
          </Table.Tr>
        )}

        <Table.Tr>
          <Table.Th scope="row">
            <Rhf.Label name="description">설명</Rhf.Label>
          </Table.Th>
          <Table.Td colSpan={3}>
            <Rhf.TextArea name="description" disabled={!editable} />
          </Table.Td>
        </Table.Tr>
      </Table.Body>
    </Table>
  );
};

export default ProductForm;

'use client';

import { isEmpty } from 'lodash-es';

import Button from '@components/Button';
import Rhf from '@components/Form';
import { Table } from '@components/Table';
import Title from '@components/Title';

import * as css from './product.css';
import useProduct from './useProduct';

import type { ProductUseFormType } from './useProduct';

const AdminProduct = () => {
  const {
    productForm,
    saleRate,
    categories,
    subCategories,
    handleCategoryRegisterButton,
    handleSubmit,
  } = useProduct();

  return (
    <>
      <Title>상품 등록</Title>
      <Rhf.Form {...productForm} onSubmit={handleSubmit}>
        <Table>
          <Table.Body>
            <Table.Tr>
              <Table.Th scope="row">
                <Rhf.Label name="name" required>
                  상품명
                </Rhf.Label>
              </Table.Th>
              <Table.Td>
                <Rhf.Input name="name" required />
              </Table.Td>
              <Table.Th scope="row">
                <Rhf.Label name="quantity">수량</Rhf.Label>
              </Table.Th>
              <Table.Td>
                <Rhf.Input
                  type="number"
                  name="quantity"
                  rules={{
                    min: 0,
                  }}
                />
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th scope="row">
                <Rhf.Label name="price" required>
                  가격
                </Rhf.Label>
              </Table.Th>
              <Table.Td>
                <Rhf.Input name="price" type="number" required />
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
                      validate: (value, { price }) => {
                        if (Number(value) > Number(price))
                          return '원가보다 높을 수 없습니다.';
                      },
                    }}
                  />
                  <span className={css.calculatedSale}>{saleRate}%</span>
                </div>
                <Rhf.ErrorMessage name="salePrice" />
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th scope="row">
                <Rhf.Label name="categoryId">카테고리</Rhf.Label>
              </Table.Th>
              <Table.Td>
                {isEmpty(categories) ? (
                  <Button onClick={handleCategoryRegisterButton}>
                    카테고리 등록하기
                  </Button>
                ) : (
                  <Rhf.Select name="categoryId">
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
                  required
                >
                  <Rhf.RadioOption value="PENDING">대기</Rhf.RadioOption>
                  <Rhf.RadioOption value="IN_PROGRESS">진행</Rhf.RadioOption>
                  <Rhf.RadioOption value="STOPPED">정지</Rhf.RadioOption>
                </Rhf.Radio>
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th scope="row">
                <Rhf.Label name="image">사진첨부</Rhf.Label>
              </Table.Th>
              <Table.Td colSpan={3}>
                <Rhf.FileUpload name="image" multiple accept={'image/*'} />
                {/* image preview */}
                {/* <image href={URL.createObjectURL()} /> */}
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th scope="row">
                <Rhf.Label name="description">설명</Rhf.Label>
              </Table.Th>
              <Table.Td colSpan={3}>
                <Rhf.TextArea name="description" />
              </Table.Td>
            </Table.Tr>
          </Table.Body>
        </Table>

        <div className={css.buttonWrapper}>
          <Button fill size="large" type="submit">
            Submit
          </Button>
        </div>
      </Rhf.Form>
    </>
  );
};

export default AdminProduct;

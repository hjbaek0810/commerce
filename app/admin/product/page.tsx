'use client';

import Button from '@components/Button';
import Rhf from '@components/Form';
import { Table } from '@components/Table';
import Title from '@components/Title';

import * as css from './product.css';
import useProduct from './useProduct';

import type { ProductUseFormType } from './useProduct';

const AdminProduct = () => {
  const { productForm, saleRate } = useProduct();

  return (
    <>
      <Title>상품 등록</Title>
      <Rhf.Form {...productForm} onSubmit={() => {}}>
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
                <Rhf.Input type="number" name="quantity" />
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
                <Rhf.Label name="category">카테고리</Rhf.Label>
              </Table.Th>
              <Table.Td colSpan={3}>
                <Rhf.Select name="category">
                  <Rhf.SelectOption value="a">A</Rhf.SelectOption>
                  <Rhf.SelectOption value="b">B</Rhf.SelectOption>
                </Rhf.Select>

                {/* select box로 main 보여준 후 클릭하면 sub 는 라디오로 */}
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th scope="row">
                <Rhf.Label name="status">상품상태</Rhf.Label>
              </Table.Th>
              <Table.Td colSpan={3}>
                {/* radio - 품절, 판매중, 판매대기 */}
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th scope="row">
                <Rhf.Label name="img">사진첨부</Rhf.Label>
              </Table.Th>
              <Table.Td colSpan={3}>
                {/* type="file" */}
                <Rhf.Input name="a" />
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th scope="row">
                <Rhf.Label name="description">설명</Rhf.Label>
              </Table.Th>
              <Table.Td colSpan={3}>
                {/* textarea */}
                <Rhf.Input name="description" />
              </Table.Td>
            </Table.Tr>
          </Table.Body>
        </Table>
        <Button fill size="large" type="submit">
          Submit
        </Button>
      </Rhf.Form>
    </>
  );
};

export default AdminProduct;

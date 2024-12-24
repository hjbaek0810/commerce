import type { UseFormReturn } from 'react-hook-form';

import Image from 'next/image';

import Button from '@components/Button';
import Rhf from '@components/Form';
import Pagination from '@components/Pagination';
import { Table, TableBadge } from '@components/Table';
import { sprinkles } from '@styles/sprinkles.css';
import { getProductStatusText } from '@utils/constants/product';
import { formatNumber } from '@utils/formatter/number';

import * as css from '../adminProductList.css';

import type { AdminDeleteProductUseFormType } from './useAdminProductView';
import type { AdminProductVO } from '@api/admin/product/types/vo';
import type { PaginationProsType } from '@components/Pagination';

type AdminProductGridPropsType = {
  deleteForm: UseFormReturn<AdminDeleteProductUseFormType, any, undefined>;
  products: AdminProductVO[];
  paginationProps: PaginationProsType;
  handleTableRowClick: (id: string) => void;
  handleRemoveProduct: () => void;
};

const AdminProductGrid = ({
  products,
  paginationProps,
  deleteForm,
  handleTableRowClick,
  handleRemoveProduct,
}: AdminProductGridPropsType) => {
  return (
    <>
      <Rhf.Form
        {...deleteForm}
        onSubmit={handleRemoveProduct}
        className={css.gridWrapper}
      >
        <Button size="small" type="submit">
          선택 삭제
        </Button>

        <div>
          <TableBadge>{`Total: ${formatNumber(paginationProps.totalCount)}`}</TableBadge>
          <Table>
            <Rhf.CheckboxGroup
              options={products.map(({ _id }) => _id)}
              name="productIds"
            >
              <Table.Header>
                <Table.Tr>
                  <Table.Th width="sizing-056">
                    <Rhf.Checkbox partiallyChecked />
                  </Table.Th>
                  <Table.Th>상품명</Table.Th>
                  <Table.Th>수량</Table.Th>
                  <Table.Th>판매가격</Table.Th>
                  <Table.Th>카테고리명</Table.Th>
                  <Table.Th>서브 카테고리명</Table.Th>
                  <Table.Th>상품상태</Table.Th>
                  <Table.Th>preview</Table.Th>
                </Table.Tr>
              </Table.Header>
              <Table.Body>
                {products.length === 0 && (
                  <Table.Tr>
                    <Table.Td
                      colSpan={8}
                      className={sprinkles({ textAlign: 'center' })}
                    >
                      no data available
                    </Table.Td>
                  </Table.Tr>
                )}
                {products.map(
                  ({
                    _id,
                    name,
                    quantity,
                    price,
                    salePrice,
                    status,
                    category,
                    images,
                  }) => (
                    <Table.Tr
                      key={_id}
                      onClick={() => {
                        handleTableRowClick(_id);
                      }}
                    >
                      <Table.Td>
                        <Rhf.Checkbox
                          value={_id}
                          onChange={e => e.stopPropagation()}
                        />
                      </Table.Td>
                      <Table.Td>{name}</Table.Td>
                      <Table.Td>{formatNumber(quantity)}</Table.Td>
                      <Table.Td>{formatNumber(salePrice || price)}</Table.Td>
                      <Table.Td>{category.name}</Table.Td>
                      <Table.Td>{category.subCategory.name}</Table.Td>
                      <Table.Td>{getProductStatusText(status)}</Table.Td>
                      <Table.Td>
                        {images && images[0] && (
                          <Image
                            style={{
                              objectFit: 'contain',
                              width: 'auto',
                              height: 'auto',
                            }}
                            alt={name}
                            src={images[0].secureUrl}
                            width={150}
                            height={100}
                            priority
                          />
                        )}
                      </Table.Td>
                    </Table.Tr>
                  ),
                )}
              </Table.Body>
            </Rhf.CheckboxGroup>
          </Table>
        </div>
      </Rhf.Form>
      <Pagination {...paginationProps} />
    </>
  );
};

export default AdminProductGrid;

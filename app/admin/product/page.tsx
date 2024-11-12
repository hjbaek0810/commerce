'use client';

import Image from 'next/image';

import Pagination from '@components/Pagination';
import { Table } from '@components/Table';
import Title from '@components/Title';
import { formatNumber } from '@utils/formatter/number';

import useProductList from './useProduct';

const ProductList = () => {
  const { products, paginationProps, getStatusLabel } = useProductList();

  // TODO: 필터 검색 기능
  return (
    <>
      <Title>상품 목록</Title>

      <Table>
        <Table.Header>
          <Table.Tr>
            <Table.Th>상품명</Table.Th>
            <Table.Th>수량</Table.Th>
            <Table.Th>판매가격</Table.Th>
            <Table.Th>카테고리명</Table.Th>
            <Table.Th>상품상태</Table.Th>
            <Table.Th>preview</Table.Th>
          </Table.Tr>
        </Table.Header>
        <Table.Body>
          {products.map(
            ({
              _id,
              name,
              quantity,
              price,
              salePrice,
              status,
              categoryName,
              images,
            }) => (
              <Table.Tr key={_id}>
                <Table.Td>{name}</Table.Td>
                <Table.Td>{formatNumber(quantity)}</Table.Td>
                <Table.Td>{formatNumber(salePrice || price)}</Table.Td>
                <Table.Td>{categoryName}</Table.Td>
                <Table.Td>{getStatusLabel(status)}</Table.Td>
                <Table.Td>
                  {images && images[0] && (
                    <Image
                      style={{ objectFit: 'contain' }}
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
      </Table>

      <Pagination {...paginationProps} />
    </>
  );
};

export default ProductList;

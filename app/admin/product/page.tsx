'use client';

import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';

import useAdminProductList from '@app/admin/product/useAdminProductList';
import Button from '@components/Button';
import Rhf from '@components/Form';
import Pagination from '@components/Pagination';
import { Table, TableBadge } from '@components/Table';
import Title from '@components/Title';
import { sprinkles } from '@styles/sprinkles.css';
import {
  ProductSortType,
  ProductStatusType,
  getProductStatusText,
} from '@utils/constants/product';
import { formatNumber } from '@utils/formatter/number';

const ProductList = () => {
  const {
    categories,
    subCategories,
    products,
    paginationProps,
    searchAdminProductForm,
    deleteProductForm,
    handleTableRowClick,
    handleFilterResetButtonClick,
    handleGoToProductRegisterButtonClick,
    handleAdminSearchProduct,
    handleSortChange,
    handleRemoveProduct,
  } = useAdminProductList();

  return (
    <>
      <Title>상품 목록</Title>
      <div
        className={sprinkles({
          display: 'flex',
          flexDirection: 'column',
          gap: 'spacing-024',
          alignItems: 'flex-end',
        })}
      >
        <Rhf.Form
          {...searchAdminProductForm}
          className={sprinkles({
            display: 'flex',
            flexDirection: 'column',
            gap: 'spacing-024',
            alignItems: 'center',
          })}
          onSubmit={handleAdminSearchProduct}
        >
          <div
            className={sprinkles({
              display: 'flex',
              flexDirection: 'column',
              gap: 'spacing-012',
              alignItems: 'flex-end',
            })}
          >
            <Button size="small" onClick={handleFilterResetButtonClick}>
              Reset
            </Button>
            <Table>
              <Table.Body>
                <Table.Tr>
                  <Table.Th scope="row">
                    <Rhf.Label name="category">카테고리</Rhf.Label>
                  </Table.Th>
                  <Table.Td>
                    <Rhf.Select name="category" hiddenPlaceholder>
                      <Rhf.SelectOption value="">ALL</Rhf.SelectOption>
                      {categories.map(({ _id, name }) => (
                        <Rhf.SelectOption key={_id} value={_id}>
                          {name}
                        </Rhf.SelectOption>
                      ))}
                    </Rhf.Select>
                  </Table.Td>
                  <Table.Th scope="row">
                    <Rhf.Label name="subCategory">서브 카테고리</Rhf.Label>
                  </Table.Th>
                  <Table.Td>
                    <Rhf.Radio
                      name="subCategory"
                      className={sprinkles({
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'spacing-004',
                      })}
                    >
                      <Rhf.RadioOption value="">ALL</Rhf.RadioOption>
                      {subCategories.map(sub => (
                        <Rhf.RadioOption key={sub._id} value={sub._id}>
                          {sub.name}
                        </Rhf.RadioOption>
                      ))}
                    </Rhf.Radio>
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th scope="row">
                    <Rhf.Label name="name">상품명</Rhf.Label>
                  </Table.Th>
                  <Table.Td>
                    <Rhf.Input name="name" />
                  </Table.Td>
                  <Table.Th scope="row">
                    <Rhf.Label name="status">상품상태</Rhf.Label>
                  </Table.Th>
                  <Table.Td>
                    <Rhf.Select name="status" hiddenPlaceholder>
                      <Rhf.SelectOption value="">ALL</Rhf.SelectOption>
                      <Rhf.SelectOption value={ProductStatusType.IN_PROGRESS}>
                        판매
                      </Rhf.SelectOption>
                      <Rhf.SelectOption value={ProductStatusType.STOPPED}>
                        판매 중지
                      </Rhf.SelectOption>
                      <Rhf.SelectOption value={ProductStatusType.HIDDEN}>
                        상품 숨김
                      </Rhf.SelectOption>
                    </Rhf.Select>
                  </Table.Td>
                </Table.Tr>
              </Table.Body>
            </Table>
          </div>

          <Button type="submit" size="large" fill>
            Search
          </Button>

          <div
            className={sprinkles({
              width: 'sizing-half',
              alignSelf: 'flex-end',
            })}
          >
            <Rhf.Select
              name="sort"
              onChange={handleSortChange}
              hiddenPlaceholder
            >
              <Rhf.SelectOption value={ProductSortType.NEWEST}>
                최신 순
              </Rhf.SelectOption>
              <Rhf.SelectOption value={ProductSortType.OLDEST}>
                오래된 순
              </Rhf.SelectOption>
              <Rhf.SelectOption value={ProductSortType.POPULARITY}>
                인기 순
              </Rhf.SelectOption>
              <Rhf.SelectOption value={ProductSortType.PRICE_HIGH}>
                가격 높은 순
              </Rhf.SelectOption>
              <Rhf.SelectOption value={ProductSortType.PRICE_LOW}>
                가격 낮은 순
              </Rhf.SelectOption>
            </Rhf.Select>
          </div>
        </Rhf.Form>

        {/* result */}
        <div>
          <Rhf.Form
            {...deleteProductForm}
            onSubmit={handleRemoveProduct}
            className={sprinkles({
              display: 'flex',
              flexDirection: 'column',
              gap: 'spacing-004',
              alignItems: 'flex-end',
            })}
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
                          <Table.Td>
                            {formatNumber(salePrice || price)}
                          </Table.Td>
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
        </div>

        <Button
          size="large"
          fill
          onClick={handleGoToProductRegisterButtonClick}
        >
          <FontAwesomeIcon icon={faPlus} />
        </Button>
      </div>
    </>
  );
};

export default ProductList;

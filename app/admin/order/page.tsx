'use client';

import useAdminOrder from '@app/admin/order/useAdminOrder';
import Button from '@components/Button';
import Rhf from '@components/Form';
import OrderStatusBadge from '@components/OrderStatusBadge';
import Pagination from '@components/Pagination';
import { Table } from '@components/Table';
import Title from '@components/Title';
import { sprinkles } from '@styles/sprinkles.css';
import { OrderSortType } from '@utils/constants/order';
import { formatDateTime } from '@utils/formatter/datetime';
import { formatNumber } from '@utils/formatter/number';

import * as css from './adminOrder.css';

const AdminOrder = () => {
  const {
    orderList,
    paginationProps,
    searchOrderForm,
    getOrderStatusOptions,
    handleSearchOrder,
    handleFilterResetButtonClick,
    handleSortChange,
    handleGoToOrderDetail,
  } = useAdminOrder();

  return (
    <>
      <Title>주문 조회</Title>

      <div className={css.orderWrapper}>
        <Rhf.Form
          {...searchOrderForm}
          className={css.filterWrapper}
          onSubmit={handleSearchOrder}
        >
          <div className={css.tableWrapper}>
            <Button size="small" onClick={handleFilterResetButtonClick}>
              Reset
            </Button>
            <Table>
              <Table.Body>
                <Table.Tr>
                  <Table.Th scope="row">
                    <Rhf.Label name="_id">주문번호</Rhf.Label>
                  </Table.Th>
                  <Table.Td>
                    <Rhf.Input name="_id" />
                  </Table.Td>
                  <Table.Th scope="row">
                    <Rhf.Label name="status">주문상태</Rhf.Label>
                  </Table.Th>
                  <Table.Td>
                    <Rhf.Select name="status" hiddenPlaceholder>
                      <Rhf.SelectOption value="">ALL</Rhf.SelectOption>
                      {getOrderStatusOptions.map(item => (
                        <Rhf.SelectOption key={item.value} value={item.value}>
                          {item.name}
                        </Rhf.SelectOption>
                      ))}
                    </Rhf.Select>
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th scope="row">
                    <Rhf.Label name="userId">주문자번호</Rhf.Label>
                  </Table.Th>
                  <Table.Td>
                    <Rhf.Input name="userId" />
                  </Table.Td>
                  <Table.Th scope="row">
                    <Rhf.Label name="username">주문자</Rhf.Label>
                  </Table.Th>
                  <Table.Td>
                    <Rhf.Input name="username" />
                  </Table.Td>
                </Table.Tr>
              </Table.Body>
            </Table>
          </div>

          <Button size="large" fill type="submit">
            Search
          </Button>

          <div className={css.sortWrapper}>
            <Rhf.Select
              name="sort"
              onChange={handleSortChange}
              hiddenPlaceholder
            >
              <Rhf.SelectOption value={OrderSortType.NEWEST}>
                주문 최신 순
              </Rhf.SelectOption>
              <Rhf.SelectOption value={OrderSortType.OLDEST}>
                주문 오래된 순
              </Rhf.SelectOption>
            </Rhf.Select>
          </div>
        </Rhf.Form>

        <Table>
          <Table.Header>
            <Table.Tr>
              <Table.Th>주문번호</Table.Th>
              <Table.Th>주문자번호</Table.Th>
              <Table.Th>주문자</Table.Th>
              <Table.Th>주문건</Table.Th>
              <Table.Th>주문상태</Table.Th>
              <Table.Th>주문날짜</Table.Th>
            </Table.Tr>
          </Table.Header>
          <Table.Body>
            {orderList.length === 0 && (
              <Table.Tr>
                <Table.Td
                  colSpan={6}
                  className={sprinkles({ textAlign: 'center' })}
                >
                  no data available
                </Table.Td>
              </Table.Tr>
            )}

            {orderList.map(
              ({ _id, userId, username, items, status, createdAt }) => (
                <Table.Tr key={_id} onClick={() => handleGoToOrderDetail(_id)}>
                  <Table.Td>{_id}</Table.Td>
                  <Table.Td>{userId}</Table.Td>
                  <Table.Td>{username}</Table.Td>
                  <Table.Td>{formatNumber(items.length)}</Table.Td>
                  <Table.Td>
                    <OrderStatusBadge status={status} size="small" />
                  </Table.Td>
                  <Table.Td>{formatDateTime(createdAt)}</Table.Td>
                </Table.Tr>
              ),
            )}
          </Table.Body>
        </Table>
        <Pagination {...paginationProps} />
      </div>
    </>
  );
};

export default AdminOrder;

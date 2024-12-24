import OrderStatusBadge from '@components/OrderStatusBadge';
import Pagination from '@components/Pagination';
import { Table, TableBadge } from '@components/Table';
import { sprinkles } from '@styles/sprinkles.css';
import { formatDateTime } from '@utils/formatter/datetime';
import { formatNumber } from '@utils/formatter/number';

import type { OrderVO } from '@api/order/types/vo';
import type { PaginationProsType } from '@components/Pagination';

type AdminOrderGridPropsType = {
  orders: OrderVO[];
  paginationProps: PaginationProsType;
  handleGoToOrderDetail: (id: string) => void;
};

const AdminOrderGrid = ({
  orders,
  paginationProps,
  handleGoToOrderDetail,
}: AdminOrderGridPropsType) => {
  return (
    <>
      <TableBadge>{`Total: ${formatNumber(paginationProps.totalCount)}`}</TableBadge>
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
          {orders.length === 0 && (
            <Table.Tr>
              <Table.Td
                colSpan={6}
                className={sprinkles({ textAlign: 'center' })}
              >
                no data available
              </Table.Td>
            </Table.Tr>
          )}

          {orders.map(({ _id, userId, username, items, status, createdAt }) => (
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
          ))}
        </Table.Body>
      </Table>
      <Pagination {...paginationProps} />
    </>
  );
};

export default AdminOrderGrid;

import Pagination from '@components/Pagination';
import { Table, TableBadge } from '@components/Table';
import { sprinkles } from '@styles/sprinkles.css';
import { formatDateTime } from '@utils/formatter/datetime';
import { formatNumber } from '@utils/formatter/number';

import type { AdminUserVO } from '@api/admin/user/types/vo';
import type { PaginationProsType } from '@components/Pagination';

type AdminUserGridPropsType = {
  users: AdminUserVO[];
  paginationProps: PaginationProsType;
};

const AdminUserGrid = ({ users, paginationProps }: AdminUserGridPropsType) => {
  return (
    <>
      <TableBadge>Total: {formatNumber(paginationProps.totalCount)}</TableBadge>
      <Table>
        <Table.Header>
          <Table.Tr>
            <Table.Th>사용자 이름</Table.Th>
            <Table.Th>아이디</Table.Th>
            <Table.Th>이메일</Table.Th>
            <Table.Th>연락처</Table.Th>
            <Table.Th>주소</Table.Th>
            <Table.Th>가입일자</Table.Th>
          </Table.Tr>
        </Table.Header>
        <Table.Body>
          {users.length === 0 && (
            <Table.Tr>
              <Table.Td
                colSpan={6}
                className={sprinkles({ textAlign: 'center' })}
              >
                no data available
              </Table.Td>
            </Table.Tr>
          )}
          {users.map(
            ({
              _id,
              name,
              loginId,
              email,
              telephone,
              postCode,
              address,
              subAddress,
              createdAt,
            }) => (
              <Table.Tr key={_id}>
                <Table.Td>{name}</Table.Td>
                <Table.Td>{loginId}</Table.Td>
                <Table.Td>{email}</Table.Td>
                <Table.Td>{telephone}</Table.Td>
                <Table.Td>{`${postCode} ${address} ${subAddress}`}</Table.Td>
                <Table.Td>{formatDateTime(createdAt)}</Table.Td>
              </Table.Tr>
            ),
          )}
        </Table.Body>
      </Table>

      <Pagination {...paginationProps} />
    </>
  );
};

export default AdminUserGrid;

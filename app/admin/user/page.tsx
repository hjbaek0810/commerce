'use client';

import useAdminUsers from '@app/admin/user/useAdminUsers';
import Button from '@components/Button';
import Rhf from '@components/Form';
import Pagination from '@components/Pagination';
import { Table, TableBadge } from '@components/Table';
import Title from '@components/Title';
import { sprinkles } from '@styles/sprinkles.css';
import { formatNumber } from '@utils/formatter/number';
import { PHONE_MAX_LENGTH } from '@utils/validation/telephone';

const AdminUsers = () => {
  const {
    users,
    paginationProps,
    searchUserForm,
    handleSearchUser,
    handleTelephoneInput,
    handleFilterResetButtonClick,
  } = useAdminUsers();

  return (
    <>
      <Title>Users</Title>
      <Rhf.Form
        {...searchUserForm}
        onSubmit={handleSearchUser}
        className={sprinkles({
          display: 'flex',
          flexDirection: 'column',
          gap: 'spacing-024',
          alignItems: 'center',
          paddingBottom: 'spacing-024',
        })}
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
                  <Rhf.Label name="name">사용자 이름</Rhf.Label>
                </Table.Th>
                <Table.Td>
                  <Rhf.Input name="name" />
                </Table.Td>
                <Table.Th scope="row">
                  <Rhf.Label name="loginId">아이디</Rhf.Label>
                </Table.Th>
                <Table.Td>
                  <Rhf.Input name="loginId" />
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th scope="row">
                  <Rhf.Label name="email">이메일</Rhf.Label>
                </Table.Th>
                <Table.Td>
                  <Rhf.Input name="email" />
                </Table.Td>
                <Table.Th scope="row">
                  <Rhf.Label name="telephone">연락처</Rhf.Label>
                </Table.Th>
                <Table.Td>
                  <Rhf.Input
                    type="tel"
                    name="telephone"
                    onInput={handleTelephoneInput}
                    maxLength={PHONE_MAX_LENGTH}
                  />
                </Table.Td>
              </Table.Tr>
            </Table.Body>
          </Table>
        </div>

        <Button type="submit" size="large" fill>
          Search
        </Button>
      </Rhf.Form>

      <TableBadge>Total: {formatNumber(paginationProps.totalCount)}</TableBadge>
      <Table>
        <Table.Header>
          <Table.Tr>
            <Table.Th>사용자 이름</Table.Th>
            <Table.Th>아이디</Table.Th>
            <Table.Th>이메일</Table.Th>
            <Table.Th>연락처</Table.Th>
            <Table.Th>주소</Table.Th>
          </Table.Tr>
        </Table.Header>
        <Table.Body>
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
            }) => (
              <Table.Tr key={_id}>
                <Table.Td>{name}</Table.Td>
                <Table.Td>{loginId}</Table.Td>
                <Table.Td>{email}</Table.Td>
                <Table.Td>{telephone}</Table.Td>
                <Table.Td>{`${postCode} ${address} ${subAddress}`}</Table.Td>
              </Table.Tr>
            ),
          )}
        </Table.Body>
      </Table>

      <Pagination {...paginationProps} />
    </>
  );
};

export default AdminUsers;

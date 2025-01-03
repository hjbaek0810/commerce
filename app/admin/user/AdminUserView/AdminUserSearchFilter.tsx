import type { FormEvent } from 'react';
import type { UseFormReturn } from 'react-hook-form';

import Button from '@components/Button';
import Rhf from '@components/Form';
import { Table } from '@components/Table';
import { sprinkles } from '@styles/sprinkles.css';
import { PHONE_MAX_LENGTH } from '@utils/validation/telephone';

import * as css from '../adminUser.css';

import type { AdminSearchUser } from '@api/admin/user/types/dto';
import type { RhfDateInputHookProps } from '@components/Form/DateInput/useRhfDateRange';

type AdminUserSearchFilterPropsType = {
  searchForm: UseFormReturn<AdminSearchUser>;
  handleSearchUser: (data: AdminSearchUser) => void;
  handleFilterResetButtonClick: () => void;
  handleTelephoneInput: (event: FormEvent<HTMLInputElement>) => void;
} & RhfDateInputHookProps;

const AdminUserSearchFilter = ({
  searchForm,
  handleSearchUser,
  handleTelephoneInput,
  handleFilterResetButtonClick,
  startDate,
  endDate,
  handleStartDateChange,
  handleEndDateChange,
}: AdminUserSearchFilterPropsType) => {
  return (
    <Rhf.Form
      {...searchForm}
      onSubmit={handleSearchUser}
      className={css.searchFilterWrapper}
    >
      <div className={css.resetWithFilterWrapper}>
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
            <Table.Tr>
              <Table.Th scope="row">
                <Rhf.Label name="startDate">가입 일자</Rhf.Label>
              </Table.Th>
              <Table.Td>
                <div
                  className={sprinkles({ display: 'flex', gap: 'spacing-004' })}
                >
                  <Rhf.DateInput
                    name="startDate"
                    selectsStart
                    onChange={handleStartDateChange}
                    startDate={startDate}
                    endDate={endDate}
                  />
                  <Rhf.DateInput
                    name="endDate"
                    selectsEnd
                    onChange={handleEndDateChange}
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                  />
                </div>
              </Table.Td>
            </Table.Tr>
          </Table.Body>
        </Table>
      </div>

      <Button type="submit" size="large" fill>
        Search
      </Button>
    </Rhf.Form>
  );
};

export default AdminUserSearchFilter;

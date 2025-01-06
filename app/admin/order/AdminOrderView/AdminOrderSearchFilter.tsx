import type { UseFormReturn } from 'react-hook-form';

import Button from '@components/Button';
import Rhf from '@components/Form';
import { Table } from '@components/Table';
import { sprinkles } from '@styles/sprinkles.css';
import { OrderSortType } from '@utils/constants/order';

import * as css from '../adminOrder.css';

import type { SearchAdminOrder } from '@api/admin/order/types/dto';
import type { RhfDateInputHookProps } from '@components/Form/DateInput/useRhfDateRange';
import type { OrderStatus } from '@utils/constants/order';

type AdminOrderSearchFilterPropsType = {
  searchForm: UseFormReturn<SearchAdminOrder>;
  getOrderStatusOptions: {
    name: string;
    value: OrderStatus;
  }[];
  handleSearchOrder: (data: SearchAdminOrder) => void;
  handleFilterResetButtonClick: () => void;
  handleSortChange: () => void;
} & RhfDateInputHookProps;

const AdminOrderSearchFilter = ({
  searchForm,
  getOrderStatusOptions,
  handleSearchOrder,
  handleFilterResetButtonClick,
  handleSortChange,
  startDate,
  endDate,
  handleStartDateChange,
  handleEndDateChange,
}: AdminOrderSearchFilterPropsType) => {
  return (
    <Rhf.Form
      {...searchForm}
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
                <Rhf.Label isLegend>주문상태</Rhf.Label>
              </Table.Th>
              <Table.Td>
                <Rhf.CheckboxGroup
                  name="status"
                  options={getOrderStatusOptions.map(item => item.value)}
                >
                  {getOrderStatusOptions.map(item => (
                    <Rhf.Checkbox
                      key={item.value}
                      value={item.value}
                      label={item.name}
                    />
                  ))}
                </Rhf.CheckboxGroup>
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
            <Table.Tr>
              <Table.Th scope="row">
                <Rhf.Label isLegend>주문 일자</Rhf.Label>
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

      <Button size="large" fill type="submit">
        Search
      </Button>

      <div className={css.sortWrapper}>
        <Rhf.Select name="sort" onChange={handleSortChange} hiddenPlaceholder>
          <Rhf.SelectOption value={OrderSortType.NEWEST}>
            주문 최신 순
          </Rhf.SelectOption>
          <Rhf.SelectOption value={OrderSortType.OLDEST}>
            주문 오래된 순
          </Rhf.SelectOption>
        </Rhf.Select>
      </div>
    </Rhf.Form>
  );
};

export default AdminOrderSearchFilter;

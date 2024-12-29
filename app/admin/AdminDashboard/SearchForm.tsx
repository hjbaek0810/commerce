import type { FieldValues, UseFormReturn } from 'react-hook-form';

import Button from '@components/Button';
import Rhf from '@components/Form';
import { sprinkles } from '@styles/sprinkles.css';
import { DashboardDateRangeType } from '@utils/constants/dashboard';

import * as css from '../adminHome.css';

import type { SearchDateType } from '@app/admin/AdminDashboard/utils';

type DashboardSearchFormPropsType<T extends FieldValues> = {
  searchForm: UseFormReturn<T>;
  startDate?: Date;
  endDate?: Date;
  activeButton: (filter: SearchDateType) => boolean;
  handleDateFilterSelection: (filter: SearchDateType) => void;
  handleStartDateChange: (date: Date | null) => void;
  handleEndDateChange: (date: Date | null) => void;
  handleSearchButtonClick: (data: T) => void;
  handleResetButtonClick: () => void;
};

const DashboardSearchForm = <T extends FieldValues>({
  searchForm,
  startDate,
  endDate,
  activeButton,
  handleDateFilterSelection,
  handleStartDateChange,
  handleEndDateChange,
  handleSearchButtonClick,
  handleResetButtonClick,
}: DashboardSearchFormPropsType<T>) => {
  return (
    <div className={css.searchForm}>
      <div
        className={sprinkles({
          display: 'flex',
          gap: 'spacing-004',
        })}
      >
        <Button
          fullWidth
          fill={activeButton('today')}
          size="small"
          onClick={() => handleDateFilterSelection('today')}
        >
          오늘
        </Button>
        <Button
          fullWidth
          fill={activeButton('thisMonth')}
          size="small"
          onClick={() => handleDateFilterSelection('thisMonth')}
        >
          이번 달
        </Button>
      </div>
      <div
        className={sprinkles({
          display: 'flex',
          gap: 'spacing-004',
        })}
      >
        <Button
          fullWidth
          fill={activeButton('7days')}
          size="small"
          onClick={() => handleDateFilterSelection('7days')}
        >
          7일전
        </Button>
        <Button
          fullWidth
          fill={activeButton('15days')}
          size="small"
          onClick={() => handleDateFilterSelection('15days')}
        >
          15일전
        </Button>
        <Button
          fullWidth
          fill={activeButton('30days')}
          size="small"
          onClick={() => handleDateFilterSelection('30days')}
        >
          30일전
        </Button>
      </div>

      <Rhf.Form
        {...searchForm}
        onSubmit={handleSearchButtonClick}
        className={css.searchDateWrapper}
      >
        <div className={css.dateInputWrapper}>
          <Rhf.DateInput
            name="startDate"
            selectsStart
            onChange={handleStartDateChange}
            startDate={startDate}
            endDate={endDate}
          />
          <span
            className={sprinkles({
              paddingX: 'spacing-004',
            })}
          >
            -
          </span>
          <Rhf.DateInput
            name="endDate"
            selectsEnd
            onChange={handleEndDateChange}
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
          />
        </div>

        <Rhf.Radio
          name="dateRangeType"
          className={sprinkles({
            display: 'flex',
            gap: 'spacing-008',
            justifyContent: 'flex-end',
          })}
        >
          <Rhf.RadioOption value={DashboardDateRangeType.DAILY}>
            일 별
          </Rhf.RadioOption>
          <Rhf.RadioOption value={DashboardDateRangeType.MONTHLY}>
            월 별
          </Rhf.RadioOption>
        </Rhf.Radio>

        <div
          className={sprinkles({
            display: 'flex',
            gap: 'spacing-004',
            justifyContent: 'flex-end',
          })}
        >
          <Button type="submit">Search</Button>
          <Button onClick={handleResetButtonClick}>Reset</Button>
        </div>
      </Rhf.Form>
    </div>
  );
};

export default DashboardSearchForm;

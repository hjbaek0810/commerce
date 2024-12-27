import type { ReactDatePickerCustomHeaderProps } from 'react-datepicker';

import {
  faArrowLeft,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getMonth, getYear } from 'date-fns';

import Button from '@components/Button';

import * as css from './calendar.css';

const YEARS = Array.from(
  { length: getYear(new Date()) + 1 - 2000 },
  (_, i) => getYear(new Date()) - i,
);

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const CalendarHeader = ({
  date,
  changeYear,
  changeMonth,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}: ReactDatePickerCustomHeaderProps) => {
  const selectedYear = getYear(date);
  const selectedMonth = getMonth(date);

  return (
    <div className={css.headerWrapper}>
      <Button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
        <FontAwesomeIcon icon={faChevronLeft} />
      </Button>
      <div className={css.headerSelectorsWrapper}>
        <select
          className={css.headerSelector}
          onChange={e => changeYear(e.target.value as unknown as number)}
          value={selectedYear}
        >
          {YEARS.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <select
          className={css.headerSelector}
          onChange={e => changeMonth(MONTHS.indexOf(e.target.value))}
          value={MONTHS[selectedMonth]}
        >
          {MONTHS.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <Button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
        <FontAwesomeIcon icon={faChevronRight} />
      </Button>
    </div>
  );
};

export default CalendarHeader;

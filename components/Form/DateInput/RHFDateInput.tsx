import type { SyntheticEvent } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import type { FieldValues, Path, PathValue } from 'react-hook-form';
import { Controller, useFormContext } from 'react-hook-form';

import { isEmpty } from 'lodash-es';

import type { DatePickerProps } from 'react-datepicker';

import { RHFRules } from '@components/Form';
import DateInput from '@components/Form/DateInput';
import CalendarHeader from '@components/Form/DateInput/CalendarHeader';
import TodayButton from '@components/Form/DateInput/TodayButton';

import * as css from './calendar.css';

import type { CommonRHFPropsType } from '@components/Form';
import type { DateInputPropsType } from '@components/Form/DateInput';

type PickReactDatePickerPropsType = Pick<
  DatePickerProps,
  | 'dateFormat'
  | 'minDate'
  | 'maxDate'
  | 'startDate'
  | 'endDate'
  | 'selectsStart'
  | 'selectsEnd'
  | 'excludeDates'
  | 'inline'
  | 'popperPlacement'
>;

type RHFDateInputPropsType<T extends FieldValues> = CommonRHFPropsType<
  Omit<DateInputPropsType, 'value' | 'onChange'>,
  T
> & {
  resetErrorOnBlur?: boolean;
  onChange?: (
    date: Date | null,
    event?: SyntheticEvent<unknown, Event>,
  ) => void;
} & PickReactDatePickerPropsType;

const RHFDateInput = <T extends FieldValues>({
  name = '' as Path<T>,
  rules,
  disabled,
  defaultValue,
  placeholder,
  onChange,
  required,
  dateFormat,
  minDate,
  maxDate,
  startDate,
  endDate,
  selectsStart,
  selectsEnd,
  excludeDates,
  inline,
  popperPlacement,
  ...restProps
}: RHFDateInputPropsType<T>) => {
  const { control } = useFormContext<T>();

  const convertDateToStandardFormat = (date: Date) =>
    new Intl.DateTimeFormat('en-CA').format(date);

  const convertedDateFormat = dateFormat || 'YYYY-MM-dd';

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue as PathValue<T, Path<T>>}
      disabled={disabled}
      render={({ field, fieldState }) => {
        const { value, ref, ...restFieldProps } = field;

        return (
          <DatePicker
            {...restFieldProps}
            minDate={minDate}
            maxDate={maxDate}
            startDate={startDate}
            endDate={endDate}
            selectsStart={selectsStart}
            selectsEnd={selectsEnd}
            excludeDates={excludeDates}
            inline={inline}
            popperPlacement={popperPlacement}
            calendarClassName={css.calenderWrapper}
            weekDayClassName={() => css.week}
            dayClassName={() => css.day}
            dateFormat={convertedDateFormat}
            placeholderText={placeholder || 'YYYY-MM-DD'}
            selected={value}
            onChange={(date, event) => {
              const formattedDate = date
                ? convertDateToStandardFormat(date)
                : null;

              if (value !== formattedDate) {
                field.onChange(formattedDate, event);
                onChange?.(date, event);
              }
            }}
            ref={ref}
            customInput={
              <DateInput {...restProps} error={!isEmpty(fieldState.error)} />
            }
            renderCustomHeader={headers => <CalendarHeader {...headers} />}
            todayButton={<TodayButton />}
          />
        );
      }}
      rules={RHFRules(rules, required)}
    />
  );
};

export default RHFDateInput;

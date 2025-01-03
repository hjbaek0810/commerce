import { useState } from 'react';
import type {
  FieldValues,
  Path,
  PathValue,
  UseFormSetValue,
} from 'react-hook-form';

export type RhfDateInputHookProps = {
  startDate?: Date;
  endDate?: Date;
  handleStartDateChange: (date: Date | null) => void;
  handleEndDateChange: (date: Date | null) => void;
};

const useRhfDateRange = <T extends FieldValues>(
  startDateName: Path<T>,
  endDateName: Path<T>,
  setValue: UseFormSetValue<T>,
) => {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const handleStartDateChange = (date: Date | null) => {
    if (date && endDate && date.getTime() > endDate.getTime()) {
      setStartDate(date);
      setEndDate(undefined);
      setValue(endDateName, undefined as PathValue<T, Path<T>>);
    } else setStartDate(date ?? undefined);
  };

  const handleEndDateChange = (date: Date | null) => {
    if (date && startDate && date.getTime() < startDate.getTime()) {
      setEndDate(undefined);
      setValue(endDateName, undefined as PathValue<T, Path<T>>);
    } else setEndDate(date ?? undefined);
  };

  const handleResetDate = () => {
    setStartDate(undefined);
    setEndDate(undefined);
  };

  return {
    startDate,
    endDate,
    handleStartDateChange,
    handleEndDateChange,
    handleResetDate,
  };
};

export default useRhfDateRange;

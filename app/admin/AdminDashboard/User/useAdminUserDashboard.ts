import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { format, subDays } from 'date-fns';
import { useSearchParams } from 'next/navigation';

import { useAdminDashboardUserQuery } from '@services/queries/dashboard';

import type { SearchUserAdminDashboard } from '@api/admin/dashboard/types/dto';

const DEFAULT_START_DATE = 30;

const useAdminUserDashboard = () => {
  const { data: userData, changeSearchParams } = useAdminDashboardUserQuery();
  const searchParams = useSearchParams();

  const searchUserForm = useForm<SearchUserAdminDashboard>({
    values: {
      startDate: searchParams.get('startDate') || '',
      endDate: searchParams.get('endDate') || '',
    },
  });
  const { setValue } = searchUserForm;

  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const calculatePastDate = (daysAgo: number) => {
    if (daysAgo < 0) throw new Error('Days ago cannot be negative');

    return format(subDays(new Date(), daysAgo), 'yyyy-MM-dd');
  };

  const activeButton = (daysAgo: number) => {
    const calculatedStartDate = `startDate=${calculatePastDate(daysAgo)}`;

    const isDefault = daysAgo === DEFAULT_START_DATE;

    if (isDefault) {
      return !searchParams.toString();
    } else {
      return calculatedStartDate === searchParams.toString();
    }
  };

  const handleDateFilterSelection = (daysAgo: number) => {
    if (daysAgo < 0) return;
    const isDefault = daysAgo === DEFAULT_START_DATE;

    changeSearchParams({
      startDate: isDefault ? '' : calculatePastDate(daysAgo),
      endDate: '',
    });
  };

  const handleStartDateChange = (date: Date | null) => {
    if (date && endDate && date.getTime() > endDate.getTime()) {
      setEndDate(undefined);
      setValue('endDate', undefined);
    } else setStartDate(date ?? undefined);
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date ?? undefined);
  };

  const handleSearchButtonClick = (data: SearchUserAdminDashboard) => {
    changeSearchParams(data);
  };

  const handleResetButtonClick = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setValue('startDate', undefined);
    setValue('endDate', undefined);

    changeSearchParams({
      startDate: '',
      endDate: '',
    });
  };

  return {
    user: userData || [],
    searchUserForm,
    startDate,
    endDate,
    activeButton,
    handleStartDateChange,
    handleEndDateChange,
    handleDateFilterSelection,
    handleSearchButtonClick,
    handleResetButtonClick,
  };
};

export default useAdminUserDashboard;

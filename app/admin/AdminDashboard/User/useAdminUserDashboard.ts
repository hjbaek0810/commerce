import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { isEqual } from 'lodash-es';

import {
  type SearchDateType,
  calculateRange,
} from '@app/admin/AdminDashboard/utils';
import { useAdminUserDashboardQuery } from '@services/queries/dashboard';
import { DashboardDateRangeType } from '@utils/constants/dashboard';

import type { SearchAdminUserDashboard } from '@api/admin/dashboard/types/dto';

const useAdminUserDashboard = () => {
  const searchUserForm = useForm<SearchAdminUserDashboard>({
    defaultValues: {
      dateRangeType: DashboardDateRangeType.MONTHLY,
    },
  });
  const { setValue } = searchUserForm;

  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const [searchParams, setSearchParams] = useState<SearchAdminUserDashboard>({
    startDate: undefined,
    endDate: undefined,
    dateRangeType: DashboardDateRangeType.MONTHLY,
  });

  const { data: users } = useAdminUserDashboardQuery({
    startDate: searchParams.startDate,
    endDate: searchParams.endDate,
    dateRangeType: searchParams.dateRangeType,
  });

  const userData =
    users?.items?.map(item => ({
      name: item.date,
      google: item.loginTypes.GOOGLE.length,
      credentials: item.loginTypes.CREDENTIALS.length,
    })) || [];

  const filteredTotalUserCount = users?.items.reduce((total, currentUser) => {
    const loginTypesLength = Object.values(currentUser.loginTypes).reduce(
      (sum, loginTypeArray) => sum + loginTypeArray.length,
      0,
    );

    return total + loginTypesLength;
  }, 0);

  const activeButton = (filter: SearchDateType) => {
    const { dateRangeType, ...filteredSearchParams } = searchParams;

    return isEqual(filteredSearchParams, calculateRange(filter));
  };

  const handleDateFilterSelection = (filter: SearchDateType) => {
    const { startDate, endDate } = calculateRange(filter);

    setSearchParams({
      startDate,
      endDate,
      dateRangeType: searchParams.dateRangeType,
    });
  };

  const handleStartDateChange = (date: Date | null) => {
    if (date && endDate && date.getTime() > endDate.getTime()) {
      setStartDate(date);
      setEndDate(undefined);
      setValue('endDate', undefined);
    } else setStartDate(date ?? undefined);
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date ?? undefined);
  };

  const handleSearchButtonClick = (data: SearchAdminUserDashboard) => {
    setSearchParams(data);
  };

  const handleResetButtonClick = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setValue('startDate', undefined);
    setValue('endDate', undefined);

    setSearchParams({
      startDate: undefined,
      endDate: undefined,
      dateRangeType: DashboardDateRangeType.MONTHLY,
    });
  };

  return {
    userData,
    filteredTotalUserCount,
    totalUserCount: users?.totalUserCount || 0,
    searchFormProps: {
      searchForm: searchUserForm,
      startDate,
      endDate,
      activeButton,
      handleStartDateChange,
      handleEndDateChange,
      handleDateFilterSelection,
      handleSearchButtonClick,
      handleResetButtonClick,
    },
  };
};

export default useAdminUserDashboard;

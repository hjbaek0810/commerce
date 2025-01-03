import type { FormEvent } from 'react';
import { useForm } from 'react-hook-form';

import { useSearchParams } from 'next/navigation';

import useRhfDateRange from '@components/Form/DateInput/useRhfDateRange';
import { useAdminUsersQuery } from '@services/queries/user';
import { UserSortType } from '@utils/constants/user';
import { formatPhoneNumber } from '@utils/validation/telephone';

import type { AdminSearchUser } from '@api/admin/user/types/dto';

const useAdminUserView = () => {
  const {
    data: users,
    paginationProps,
    handleSearchParamsChange,
  } = useAdminUsersQuery();
  const searchParams = useSearchParams();

  const searchUserForm = useForm<AdminSearchUser>({
    values: {
      name: searchParams.get('name') || '',
      loginId: searchParams.get('loginId') || '',
      email: searchParams.get('email') || '',
      telephone: searchParams.get('telephone') || '',
      sort: (searchParams.get('sort') as UserSortType) || UserSortType.NAME_ASC,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
    },
  });
  const { reset, setValue } = searchUserForm;

  const {
    startDate,
    endDate,
    handleStartDateChange,
    handleEndDateChange,
    handleResetDate,
  } = useRhfDateRange('startDate', 'endDate', setValue);

  const handleTelephoneInput = (event: FormEvent<HTMLInputElement>) => {
    const formattedPhoneNumber = formatPhoneNumber(event.currentTarget.value);
    setValue('telephone', formattedPhoneNumber);
  };

  const handleSearchUser = (data: AdminSearchUser) => {
    handleSearchParamsChange(data);
  };

  const handleFilterResetButtonClick = () => {
    reset();
    handleResetDate();

    handleSearchParamsChange({
      name: '',
      loginId: '',
      email: '',
      telephone: '',
      sort: UserSortType.NAME_ASC,
      startDate: '',
      endDate: '',
    });
  };

  return {
    searchFilterProps: {
      searchForm: searchUserForm,
      handleSearchUser,
      handleTelephoneInput,
      handleFilterResetButtonClick,
      startDate,
      endDate,
      handleStartDateChange,
      handleEndDateChange,
    },
    resultProps: {
      users,
      paginationProps,
    },
  };
};

export default useAdminUserView;

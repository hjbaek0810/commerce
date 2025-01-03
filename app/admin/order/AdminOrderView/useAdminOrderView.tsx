import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { isEmpty } from 'lodash-es';
import { useRouter, useSearchParams } from 'next/navigation';

import useRhfDateRange from '@components/Form/DateInput/useRhfDateRange';
import { useAdminOrderListQuery } from '@services/queries/order';
import { createEnumObject } from '@utils/constants/helper';
import {
  OrderSortType,
  OrderStatus,
  getOrderStatusText,
} from '@utils/constants/order';
import { PATH } from '@utils/path';

import type { SearchAdminOrder } from '@api/admin/order/types/dto';

const INITIAL_STATUS_VALUES = Object.keys(createEnumObject(OrderStatus)).map(
  status => status,
) as OrderStatus[];

const useAdminOrderView = () => {
  const router = useRouter();

  const {
    data: orders,
    paginationProps,
    handleSearchParamsChange,
  } = useAdminOrderListQuery();

  const searchParams = useSearchParams();

  const defaultStatusValue = searchParams.get('status')
    ? (searchParams.get('status')?.split(',') as OrderStatus[])
    : INITIAL_STATUS_VALUES;

  const searchOrderForm = useForm<SearchAdminOrder>({
    values: {
      _id: searchParams.get('_id') || '',
      userId: searchParams.get('userId') || '',
      username: searchParams.get('username') || '',
      status: defaultStatusValue,
      sort: (searchParams.get('sort') as OrderSortType) || OrderSortType.NEWEST,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
    },
  });

  const { setValue, getValues, reset, control } = searchOrderForm;

  const selectedStatus = useWatch({
    name: 'status',
    control,
    defaultValue: defaultStatusValue,
  });

  const {
    startDate,
    endDate,
    handleStartDateChange,
    handleEndDateChange,
    handleResetDate,
  } = useRhfDateRange('startDate', 'endDate', setValue);

  useEffect(() => {
    if (!selectedStatus || isEmpty(selectedStatus)) {
      setValue('status', INITIAL_STATUS_VALUES);
    }
  }, [selectedStatus, setValue]);

  const handleSearchOrder = (data: SearchAdminOrder) => {
    const { status, ...restData } = data;

    const isSearchStatus =
      status && status.length !== INITIAL_STATUS_VALUES.length;

    handleSearchParamsChange({
      status: isSearchStatus ? status : '',
      ...restData,
    });
  };

  const handleSortChange = () => {
    const sort = getValues('sort');

    handleSearchParamsChange({ sort });
  };

  const getOrderStatusOptions = INITIAL_STATUS_VALUES.map(status => {
    return {
      name: getOrderStatusText(status),
      value: status,
    };
  });

  const handleFilterResetButtonClick = () => {
    reset();
    handleResetDate();

    handleSearchParamsChange({
      _id: '',
      userId: '',
      username: '',
      status: '',
      sort: OrderSortType.NEWEST,
      startDate: '',
      endDate: '',
    });
  };

  const handleGoToOrderDetail = (id: string) =>
    router.push(PATH.ADMIN.ORDER.DETAIL(id));

  return {
    searchFilterProps: {
      searchForm: searchOrderForm,
      getOrderStatusOptions,
      handleSearchOrder,
      handleFilterResetButtonClick,
      handleSortChange,
      startDate,
      endDate,
      handleStartDateChange,
      handleEndDateChange,
    },
    resultProps: {
      orders,
      paginationProps,
      handleGoToOrderDetail,
    },
  };
};

export default useAdminOrderView;

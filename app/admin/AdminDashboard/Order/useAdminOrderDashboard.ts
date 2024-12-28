import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { format, isToday, parseISO, subDays } from 'date-fns';
import { isEqual } from 'lodash-es';

import { useAdminDashboardOrderQuery } from '@services/queries/dashboard';
import { DashboardDateRangeType } from '@utils/constants/dashboard';
import { createEnumObject } from '@utils/constants/helper';
import { OrderStatus, getOrderStatusText } from '@utils/constants/order';
import { formatNumber } from '@utils/formatter/number';

import type { SearchAdminOrderDashboard } from '@api/admin/dashboard/types/dto';

type SearchDateType = '7days' | '15days' | '30days' | 'today' | 'thisMonth';
const ALL_ORDER_STATUS = createEnumObject(OrderStatus);

const statusColorMap = {
  [OrderStatus.ORDER_CANCELLED]: '#D85C5C',
  [OrderStatus.PAYMENT_PENDING]: '#FF9800',
  [OrderStatus.PAYMENT_COMPLETED]: '#7FBF7F',
  [OrderStatus.SHIPPING_IN_PROGRESS]: '#3062E0',
  [OrderStatus.SHIPPING_PENDING]: '#4AB3E4',
  [OrderStatus.SHIPPING_COMPLETED]: '#6B9E6F',
  [OrderStatus.REFUND_PENDING]: '#FF8F00',
  [OrderStatus.REFUND_COMPLETED]: '#7FAF7C',
  [OrderStatus.RETURN_PENDING]: '#F8D300',
  [OrderStatus.RETURN_COMPLETED]: '#7DCA7D',
};

const calculatePastDate = (daysAgo: number) => {
  if (daysAgo < 0) throw new Error('Days ago cannot be negative');

  return format(subDays(new Date(), daysAgo), 'yyyy-MM-dd');
};

const calculateRange = (filter: SearchDateType) => {
  const today = new Date();

  switch (filter) {
    case '7days':
      return {
        startDate: calculatePastDate(7),
        endDate: undefined,
      };
    case '15days':
      return {
        startDate: calculatePastDate(15),
        endDate: undefined,
      };
    case '30days':
      return {
        startDate: calculatePastDate(30),
        endDate: undefined,
      };
    case 'today':
      return {
        startDate: format(today, 'yyyy-MM-dd'),
        endDate: undefined,
      };
    // BE: default
    case 'thisMonth':
      return {
        startDate: undefined,
        endDate: undefined,
      };
    default:
      return {
        startDate: undefined,
        endDate: undefined,
      };
  }
};

const useAdminOrderDashboard = () => {
  const searchOrderForm = useForm<SearchAdminOrderDashboard>({
    defaultValues: {
      dateRangeType: DashboardDateRangeType.MONTHLY,
    },
  });
  const { setValue } = searchOrderForm;

  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [totalAmountMessage, setTotalAmountMessage] = useState<string>('');

  const [searchParams, setSearchParams] = useState<SearchAdminOrderDashboard>({
    startDate: undefined,
    endDate: undefined,
    dateRangeType: DashboardDateRangeType.MONTHLY,
  });

  const { data: orderData } = useAdminDashboardOrderQuery({
    startDate: searchParams.startDate,
    endDate: searchParams.endDate,
    dateRangeType: searchParams.dateRangeType,
  });

  useEffect(() => {
    const totalAmount = orderData?.dateItems.reduce(
      (sum, item) => sum + item.totalPrice,
      0,
    );

    let message = '';

    const { startDate, endDate } = searchParams;
    if (startDate && endDate) {
      message = `${startDate} ~ ${endDate}`;
    } else if (startDate) {
      if (isToday(parseISO(startDate))) message = '오늘';
      else message = `${startDate} ~ 현재까지`;
    } else if (endDate) {
      message = `~ ${endDate}까지`;
    } else {
      message = '이번 달';
    }

    setTotalAmountMessage(`${message} 총 매출: ${formatNumber(totalAmount)}원`);
  }, [orderData, searchParams]);

  const statusList = useMemo(() => {
    const statusItems = Object.keys(ALL_ORDER_STATUS).map(status => {
      const statusData = orderData?.statusItems?.find(
        item => item.status === status,
      );

      return {
        name: getOrderStatusText(status as OrderStatus),
        status: status as OrderStatus,
        value: statusData?.count || 0,
      };
    });

    if (orderData?.statusItems.length === 0) {
      statusItems.push({
        name: 'none',
        status: '' as OrderStatus,
        value: 100,
      });
    }

    return statusItems;
  }, [orderData]);

  const totalPriceList = orderData?.dateItems.map(item => ({
    name: item.date,
    price: item.totalPrice,
  }));

  const activeButton = (filter: SearchDateType) => {
    const { dateRangeType, ...filteredSearchParams } = searchParams;

    return isEqual(filteredSearchParams, calculateRange(filter));
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

  const handleDateFilterSelection = (filter: SearchDateType) => {
    const { startDate, endDate } = calculateRange(filter);

    setSearchParams({
      startDate,
      endDate,
      dateRangeType: searchParams.dateRangeType,
    });
  };

  const handleSearchButtonClick = (data: SearchAdminOrderDashboard) => {
    setSearchParams(data);
  };

  return {
    statusList,
    totalPriceList,
    statusColorMap,
    searchOrderForm,
    startDate,
    endDate,
    totalAmountMessage,
    activeButton,
    handleStartDateChange,
    handleEndDateChange,
    handleResetButtonClick,
    handleDateFilterSelection,
    handleSearchButtonClick,
  };
};

export default useAdminOrderDashboard;

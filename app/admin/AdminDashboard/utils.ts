import { format, subDays } from 'date-fns';

export type SearchDateType =
  | '7days'
  | '15days'
  | '30days'
  | 'today'
  | 'thisMonth';

const calculatePastDate = (daysAgo: number) => {
  if (daysAgo < 0) throw new Error('Days ago cannot be negative');

  return format(subDays(new Date(), daysAgo), 'yyyy-MM-dd');
};

export const calculateRange = (filter: SearchDateType) => {
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

import { format, parseISO } from 'date-fns';
import { isNil } from 'lodash-es';

export function formatDate(dateTime?: string): string {
  if (isNil(dateTime)) return '';

  const parsedDate = parseISO(dateTime);

  return format(parsedDate, 'yyyy-MM-dd');
}

export function formatDateTime(dateTime?: string): string {
  if (isNil(dateTime)) return '';

  const parsedDate = parseISO(dateTime);

  return format(parsedDate, 'yyyy-MM-dd HH:mm:ss'); // 원하는 형식으로 변환
}

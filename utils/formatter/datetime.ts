import { isNil } from 'lodash-es';

export function formatDateTime(dateTime?: string) {
  if (isNil(dateTime)) return '';

  const date = new Date(dateTime);
  const formattedDate = date.toISOString().slice(0, 19).replace('T', ' ');

  return formattedDate;
}

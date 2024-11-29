import { isNil } from 'lodash-es';

export function formatNumber(
  value: string | number | undefined,
  locale = 'en-US',
  options: Intl.NumberFormatOptions = {},
) {
  if (isNil(value)) return '';

  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numericValue)) return '';

  const defaultOptions: Intl.NumberFormatOptions = {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  };

  return new Intl.NumberFormat(locale, defaultOptions).format(numericValue);
}

export function shouldFilterKey(
  key: string,
  value: string,
  additionalExcludedKeys: string[] = [],
) {
  const defaultExcludedKeys = ['page', 'limit', 'sort'];
  const allExcludedKeys = [...defaultExcludedKeys, ...additionalExcludedKeys]; // 기본 키 + 추가 키

  return value && !allExcludedKeys.includes(key);
}

export const isValidDateRange = (start: string, end: string) => {
  const startD = new Date(start);
  const endD = new Date(end);

  if (startD > endD) {
    return false;
  }

  return true;
};

export const setStartOfDay = (date: string) => {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);

  return d;
};

export const setEndOfDay = (date: string) => {
  const d = new Date(date);
  d.setUTCHours(23, 59, 59, 999);

  return d;
};

export const setStartOfMonth = (date: Date = new Date()): Date => {
  const startOfMonth = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1),
  );
  startOfMonth.setUTCHours(0, 0, 0, 0);

  return startOfMonth;
};

export const setEndOfMonth = (date: Date = new Date()): Date => {
  const endOfMonth = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0),
  );
  endOfMonth.setUTCHours(23, 59, 59, 999);

  return endOfMonth;
};

import { isNil } from 'lodash-es';

import { type NewObject } from '@utils/types/utility';

export function createQueryString(url: string, params: NewObject) {
  const searchParams = new URLSearchParams();

  Object.keys(params).forEach(key => {
    if (!isNil(params[key])) {
      searchParams.append(key, params[key]);
    }
  });

  const queryString = searchParams.toString();

  return `${url}?${queryString}`;
}

export const parseQueryParams = (searchParams: URLSearchParams) => {
  return Object.fromEntries(searchParams.entries());
};

import { type NewObject } from '@utils/types/utility';

// ssr 사용을 위해 라이브러리 사용 x
export function createQueryString(url: string, params: NewObject) {
  const searchParams = new URLSearchParams();

  Object.keys(params).forEach(key => {
    if (params[key] !== null && params[key] !== undefined) {
      searchParams.append(key, params[key]);
    }
  });

  const queryString = searchParams.toString();

  return `${url}?${queryString}`;
}

export const parseQueryParams = (searchParams: URLSearchParams) => {
  return Object.fromEntries(searchParams.entries());
};

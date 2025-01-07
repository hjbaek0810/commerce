import { CommonErrorException } from '@api/exception';

import { ApiError } from './error';

type FetchDataOptionsType<U> = {
  data?: U;
  headers?: HeadersInit;
  next?: NextFetchRequestConfig;
  cache?: 'no-store' | 'force-cache' | 'no-cache';
};

export async function fetchData<T, U = unknown>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  options: FetchDataOptionsType<U> = {},
) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // options.headers가 존재할 경우 이를 headers에 병합
  if (options.headers) {
    if (options.headers instanceof Headers) {
      // Headers 객체일 경우, 객체로 변환하여 병합
      options.headers.forEach((value, key) => {
        headers[key] = value;
      });
    } else {
      // 객체 형태일 경우 그대로 병합
      Object.assign(headers, options.headers);
    }
  }

  const fetchOptions: RequestInit = {
    method,
    headers,
    next: options.next,
    cache: options.cache,
  };

  if (options.data && method !== 'GET') {
    if (typeof options.data === 'object' && options.data !== null) {
      fetchOptions.body = JSON.stringify(options.data);
    }
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/${url}`,
    fetchOptions,
  );

  if (!response.ok) {
    const errorData = await response.json();

    const error = new ApiError(
      errorData.message || CommonErrorException.UNKNOWN_ERROR.message,
      errorData.code || CommonErrorException.UNKNOWN_ERROR.code,
      errorData.data,
      response.status,
    );

    throw error;
  }

  return (await response.json()) as Promise<T>;
}

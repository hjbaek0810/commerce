import { revalidatePath } from 'next/cache';

import { ApiError } from './error';

type FetchDataOptionsType<U> = {
  data?: U;
  headers?: HeadersInit;
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
  };

  if (options.data && method !== 'GET') {
    if (typeof options.data === 'object' && options.data !== null) {
      fetchOptions.body = JSON.stringify(options.data);
    }
  }

  // FIXME: 배포환경 url
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/${url}`,
    fetchOptions,
  );

  if (!response.ok) {
    const errorData = await response.json();

    if (response.status === 401 || response.status === 403) {
      revalidatePath('/');
    }

    const error = new ApiError(
      errorData.message || '서버 요청 실패',
      errorData.code || 'UNKNOWN_ERROR',
      errorData.data,
    );

    throw error;
  }

  return (await response.json()) as Promise<T>;
}

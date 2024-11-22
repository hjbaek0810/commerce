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
  const fetchOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  if (options.data && method !== 'GET')
    fetchOptions.body = JSON.stringify(options.data);

  // FIXME: 배포환경 url
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/${url}`,
    fetchOptions,
  );

  if (!response.ok) {
    const errorData = await response.json();

    const error = new ApiError(
      errorData.message || '서버 요청 실패',
      errorData.code || 'UNKNOWN_ERROR',
    );

    throw error;
  }

  return (await response.json()) as Promise<T>;
}

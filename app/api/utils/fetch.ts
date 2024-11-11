type FetchDataOptionsType<U> = {
  data?: U;
  headers?: HeadersInit;
};

export async function fetchData<T, U = unknown>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  options: FetchDataOptionsType<U> = {},
) {
  try {
    const fetchOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    if (options.data && method !== 'GET')
      fetchOptions.body = JSON.stringify(options.data);

    const response = await fetch(`/api/${url}`, fetchOptions);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '서버 요청 실패');
    }

    return (await response.json()) as Promise<T>;
  } catch (error) {
    throw error;
  }
}

type FetchDataOptionsType = {
  data?: any;
  headers?: HeadersInit;
};

export async function fetchData<T>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  options: FetchDataOptionsType = {},
) {
  try {
    const fetchOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    if (options.data) fetchOptions.body = JSON.stringify(options.data);

    const response = await fetch(`/api/${url}`, fetchOptions);

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return (await response.json()) as Promise<T>;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

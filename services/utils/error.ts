export class ApiError extends Error {
  code?: string;
  data?: any;

  constructor(message: string, code?: string, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.data = data;
  }
}

export const isApiError = (error: Error | unknown): error is ApiError => {
  if (error instanceof Error) {
    return error.name === 'ApiError';
  }

  return false;
};

export function handleError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

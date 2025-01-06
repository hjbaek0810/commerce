export class ApiError extends Error {
  code?: string;
  data?: any;
  status?: number;

  constructor(message: string, code?: string, data?: any, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.data = data;
    this.status = status;
  }
}

export const isApiError = (error: Error | unknown): error is ApiError => {
  if (error instanceof Error) {
    return error.name === 'ApiError';
  }

  return false;
};

export class FileUploadError extends Error {
  code?: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
  }
}

export const isFileUploadError = (
  error: Error | unknown,
): error is FileUploadError => {
  if (error instanceof Error) {
    return error.name === 'FileUploadError';
  }

  return false;
};

export function handleError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

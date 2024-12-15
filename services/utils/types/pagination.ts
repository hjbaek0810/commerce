import type { NewObject } from '@utils/types/utility';

export type PaginatedResponse<T extends string, K extends NewObject> = Record<
  T,
  Array<K>
> & {
  totalCount: number;
  currentPage: number;
  currentLimit: number;
};

export type PaginationQueryParamsType<T extends NewObject> = T & {
  page?: number;
  limit?: number;
};

import { fetchData } from '@services/utils/fetch';
import { API } from '@services/utils/path';

import type { CategoryVO } from '@api/category/types/vo';

export const getCategoriesQueryOptions = () => ({
  queryKey: ['categories', { scope: 'list' }],
  queryFn: () => fetchData<Array<CategoryVO>>(API.CATEGORY, 'GET'),
  staleTime: 10 * 60 * 1000,
  gcTime: 30 * 60 * 1000,
});

export const getAdminCategoriesQueryOptions = () => ({
  queryKey: ['categories', 'admin', { scope: 'list' }],
  queryFn: () => fetchData<Array<CategoryVO>>(API.ADMIN.CATEGORY, 'GET'),
  staleTime: 10 * 60 * 1000,
  gcTime: 30 * 60 * 1000,
});

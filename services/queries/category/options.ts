import { categoryKeys, categoryTags } from '@services/queries/category/keys';
import { fetchData } from '@services/utils/fetch';
import { API } from '@services/utils/path';

import type { AdminCategoryVO } from '@api/admin/category/types/vo';
import type { CategoryVO } from '@api/category/types/vo';

export const getCategoriesQueryOptions = () => ({
  queryKey: categoryKeys.getAll(),
  queryFn: () =>
    fetchData<Array<CategoryVO>>(API.CATEGORY.BASE, 'GET', {
      next: { tags: [categoryTags.all, categoryTags.list] },
    }),
  staleTime: 3 * 60 * 60 * 1000,
  gcTime: 5 * 60 * 60 * 1000,
});

export const getAdminCategoriesQueryOptions = (headers?: HeadersInit) => ({
  queryKey: categoryKeys.getAdminAll(),
  queryFn: () =>
    fetchData<Array<AdminCategoryVO>>(API.ADMIN.CATEGORY, 'GET', {
      headers,
      next: { tags: [categoryTags.all, categoryTags.adminList] },
    }),
  staleTime: 1 * 60 * 60 * 1000,
  gcTime: 3 * 60 * 60 * 1000,
});

import { categoryKeys, categoryTags } from '@services/queries/category/keys';
import { fetchData } from '@services/utils/fetch';
import { API } from '@services/utils/path';

import type { CategoryVO } from '@api/category/types/vo';

export const getCategoriesQueryOptions = () => ({
  queryKey: categoryKeys.getAll(),
  queryFn: () =>
    fetchData<Array<CategoryVO>>(API.CATEGORY.BASE, 'GET', {
      next: { tags: [categoryTags.all, categoryTags.list] },
    }),
  staleTime: 10 * 60 * 1000,
  gcTime: 30 * 60 * 1000,
});

export const getAdminCategoriesQueryOptions = () => ({
  queryKey: categoryKeys.getAdminAll(),
  queryFn: () =>
    fetchData<Array<CategoryVO>>(API.ADMIN.CATEGORY, 'GET', {
      next: { tags: [categoryTags.all, categoryTags.adminList] },
    }),
  staleTime: 10 * 60 * 1000,
  gcTime: 30 * 60 * 1000,
});

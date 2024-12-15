import { fetchData } from '@services/utils/fetch';
import { API } from '@services/utils/path';

import type { QueryClient } from '@tanstack/react-query';

export const revalidateTags = (tags: string[]) =>
  Promise.all(tags.map(tag => fetchData(API.REVALIDATE(tag))));

export const invalidateQueries = (queryClient: QueryClient, queryKeys: any[]) =>
  queryKeys.forEach(queryKey => queryClient.invalidateQueries({ queryKey }));

export const removeQueries = (queryClient: QueryClient, queryKeys: any[]) =>
  queryKeys.forEach(queryKey => queryClient.removeQueries({ queryKey }));

export const resetQueries = (queryClient: QueryClient, queryKeys: any[]) =>
  queryKeys.forEach(queryKey => queryClient.resetQueries({ queryKey }));

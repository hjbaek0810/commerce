import type { QueryClient } from '@tanstack/react-query';

export const invalidateQueries = (queryClient: QueryClient, queryKeys: any[]) =>
  queryKeys.forEach(queryKey => queryClient.invalidateQueries({ queryKey }));

export const removeQueries = (queryClient: QueryClient, queryKeys: any[]) =>
  queryKeys.forEach(queryKey => queryClient.removeQueries({ queryKey }));

export const resetQueries = (queryClient: QueryClient, queryKeys: any[]) =>
  queryKeys.forEach(queryKey => queryClient.resetQueries({ queryKey }));

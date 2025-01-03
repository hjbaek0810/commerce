import type { QueryClient } from '@tanstack/react-query';

export const invalidateQueries = (
  queryClient: QueryClient,
  queryKeys: any[],
  refetchType: 'all' | 'none' | 'active' = 'active',
) =>
  queryKeys.forEach(queryKey =>
    queryClient.invalidateQueries({ queryKey, refetchType }),
  );

export const removeQueries = (queryClient: QueryClient, queryKeys: any[]) =>
  queryKeys.forEach(queryKey => queryClient.removeQueries({ queryKey }));

export const resetQueries = (queryClient: QueryClient, queryKeys: any[]) =>
  queryKeys.forEach(queryKey => queryClient.resetQueries({ queryKey }));

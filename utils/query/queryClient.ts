import { toast } from 'react-toastify';

import { QueryClient, isServer } from '@tanstack/react-query';

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 10 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        refetchOnMount: true, // false -> invalidate 후 해당 api 호출 페이지에서 fetching 되지 않는다. (stale 상태는 업데이트, ui X)
        refetchOnReconnect: true,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
        onMutate: () => {
          toast.loading('in progress..', {
            autoClose: false,
            hideProgressBar: false,
          });
        },
        onSettled: () => {
          toast.dismiss();
        },
        onError: () => {
          toast.error('잠시 후 시도해주시기 바랍니다.');
        },
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();

    return browserQueryClient;
  }
}

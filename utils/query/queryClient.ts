import type { Id } from 'react-toastify';
import { toast } from 'react-toastify';

import { QueryClient, isServer } from '@tanstack/react-query';

import { isApiError } from '@services/utils/error';

export function makeQueryClient() {
  let loadingToastId: Id;

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 10 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        refetchOnMount: true, // false -> invalidate 후 해당 api 호출 페이지에서 fetching 되지 않는다. (stale 상태는 업데이트, ui X)
        refetchOnReconnect: true,
        refetchOnWindowFocus: false,
        throwOnError: error => {
          if (isApiError(error)) {
            const { status } = error;
            if (status && ((status >= 401 && status <= 404) || status >= 500)) {
              return true;
            }

            return false;
          }

          return true;
        },
      },
      mutations: {
        retry: false,
        throwOnError: error => {
          if (isApiError(error)) {
            const { status } = error;
            if (status && ((status >= 401 && status <= 404) || status >= 500)) {
              return true;
            }

            return false;
          }

          return true;
        },
        onMutate: () => {
          loadingToastId = toast.loading('in progress..', {
            autoClose: false,
            hideProgressBar: false,
          });
        },
        onSettled: () => {
          toast.dismiss(loadingToastId);
        },
        onError: error => {
          if (isApiError(error) && error.status === 400) {
            toast.error(
              '요청이 처리되지 않았습니다. 입력 내용을 확인하시고 다시 시도해 주세요.',
              { autoClose: false },
            );
          }
        },
      },
    },
  });

  return queryClient;
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

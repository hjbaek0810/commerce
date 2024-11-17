import { toast } from 'react-toastify';

import { QueryClient } from '@tanstack/react-query';

const CustomQueryClient = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: 0,
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
      },
    },
  });

  return queryClient;
};

export default CustomQueryClient;

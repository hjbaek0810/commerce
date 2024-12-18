import { useEffect } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { signOut, useSession } from 'next-auth/react';

const useSignOut = () => {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (status === 'unauthenticated') {
      queryClient.removeQueries();
    }
  }, [queryClient, status]);

  const handleSignOutButtonClick = () => {
    signOut({ callbackUrl: '/' });
  };

  return { session, handleSignOutButtonClick };
};

export default useSignOut;

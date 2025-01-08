import { useQueryClient } from '@tanstack/react-query';
import { signOut, useSession } from 'next-auth/react';

const useSignOut = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const handleSignOutButtonClick = () => {
    queryClient.removeQueries();
    signOut({ callbackUrl: '/' });
  };

  return { session, handleSignOutButtonClick };
};

export default useSignOut;

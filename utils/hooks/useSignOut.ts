import { useQueryClient } from '@tanstack/react-query';
import { usePathname, useSearchParams } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

const useSignOut = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const redirectUrl =
    pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');

  const handleSignOutButtonClick = () => {
    queryClient.removeQueries();

    signOut({
      callbackUrl: redirectUrl.startsWith('/product') ? redirectUrl : '/',
    });
  };

  return { session, handleSignOutButtonClick };
};

export default useSignOut;

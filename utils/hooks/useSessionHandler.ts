import { toast } from 'react-toastify';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { PATH } from '@utils/path';

const useSessionHandler = () => {
  const { data: session } = useSession();
  const isAuthenticated = !!session;
  const router = useRouter();

  const checkSession = () => {
    if (!session) {
      toast('로그인 세션이 만료되었거나 로그인이 필요합니다.');
      router.push(PATH.SIGN_IN);

      return false;
    }

    return true;
  };

  return { isAuthenticated, checkSession };
};

export default useSessionHandler;

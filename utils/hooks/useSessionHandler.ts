import { toast } from 'react-toastify';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { PATH } from '@utils/path';

const useSessionHandler = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const checkSession = () => {
    if (!session) {
      toast('세션이 만료되었습니다. 다시 로그인해주세요.');
      router.push(PATH.SIGN_IN);

      return false;
    }

    return true;
  };

  return { checkSession };
};

export default useSessionHandler;

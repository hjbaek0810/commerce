import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { useRouter } from 'next/navigation';
import { getSession } from 'next-auth/react';

import { useSignInMutation } from '@services/queries/user';
import { UserRoleType } from '@utils/constants/user';
import { PATH } from '@utils/path';

import type { SignInUser } from '@api/auth/sign-in/types/dto';

const useSignInForm = () => {
  const signInForm = useForm<SignInUser>();
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const { mutate: signIn } = useSignInMutation();
  const router = useRouter();

  const handleSignInSubmit = (data: SignInUser) => {
    if (!data.loginId || !data.password) return;
    setIsWaiting(true);

    signIn(data, {
      onSuccess: async credential => {
        if (credential?.error || !credential?.ok) {
          setIsWaiting(false);
          toast.error('아이디 또는 패스워드가 일치하지 않습니다.');
        } else {
          const session = await getSession();

          if (session?.user.role === UserRoleType.ADMIN) {
            // 사용자가 ADMIN 역할인 경우, 페이지를 새로고침하여 공통 레이아웃(Layout.tsx)에 관리자 전용 레이아웃만 렌더링되도록..
            router.replace(PATH.ADMIN.HOME);
            router.refresh();
          } else {
            router.replace('/');
          }
        }
      },
      onError: () => {
        setIsWaiting(false);
      },
    });
  };

  return { signInForm, handleSignInSubmit, isPending: isWaiting };
};

export default useSignInForm;

import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { useRouter } from 'next/navigation';
import { getSession } from 'next-auth/react';

import { useSignInMutation } from '@services/queries/user';
import { UserRoleType } from '@utils/constants/user';
import { PATH } from '@utils/path';

import type { SignInUser } from '@api/auth/sign-in/types/dto';

const useSignIn = () => {
  const signInForm = useForm<SignInUser>();
  const { mutate: signIn } = useSignInMutation();
  const router = useRouter();

  const handleSignInSubmit = (data: SignInUser) => {
    if (!data.loginId || !data.password) return;

    signIn(data, {
      onSuccess: async credential => {
        if (credential?.error || !credential?.ok) {
          toast.error('아이디 또는 패스워드가 일치하지 않습니다.');
        } else {
          const session = await getSession();

          if (session?.user.role === UserRoleType.ADMIN) {
            router.push(PATH.ADMIN.HOME);
            router.refresh();
          } else {
            router.push('/');
          }
        }
      },
    });
  };

  return { signInForm, handleSignInSubmit };
};

export default useSignIn;

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signIn } from 'next-auth/react';

import { userKeys } from '@services/queries/user/keys';
import { fetchData } from '@services/utils/fetch';
import { API } from '@services/utils/path';

import type { SignInUser } from '@api/auth/sign-in/types/dto';
import type { CreateUser } from '@api/user/types/dto';
import type { UserVO } from '@api/user/types/vo';

export const useSignUpMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUser) =>
      fetchData<UserVO, CreateUser>(API.USER.BASE, 'POST', { data }),
    onSuccess: () => {
      // reset? invalidate?
      queryClient.invalidateQueries({
        queryKey: userKeys.getAll(),
      });
    },
  });
};

export const useSignInMutation = () => {
  return useMutation({
    mutationFn: (data: SignInUser) =>
      signIn('credentials', {
        ...data,
        redirect: false,
      }),
  });
};

import { useMutation, useQuery } from '@tanstack/react-query';
import { signIn } from 'next-auth/react';

import { getMyAccountQueryOptions } from '@services/queries/user/options';
import { fetchData } from '@services/utils/fetch';
import { API } from '@services/utils/path';

import type { SignInUser } from '@api/auth/sign-in/types/dto';
import type { CreateUser } from '@api/user/types/dto';
import type { UserVO } from '@api/user/types/vo';

export const useMyAccountQuery = () => useQuery(getMyAccountQueryOptions());

export const useSignUpMutation = () =>
  useMutation({
    mutationFn: (data: CreateUser) =>
      fetchData<UserVO, CreateUser>(API.USER.BASE, 'POST', { data }),
  });

export const useSignInMutation = () => {
  return useMutation({
    mutationFn: (data: SignInUser) =>
      signIn('credentials', {
        ...data,
        redirect: false,
      }),
  });
};

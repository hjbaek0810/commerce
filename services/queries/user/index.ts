import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { signIn } from 'next-auth/react';

import { userKeys } from '@services/queries/user/keys';
import { getMyAccountQueryOptions } from '@services/queries/user/options';
import { fetchData } from '@services/utils/fetch';
import { API } from '@services/utils/path';

import type { SignInUser } from '@api/auth/sign-in/types/dto';
import type { CreateUser, UpdateUser } from '@api/user/types/dto';
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

export const useMyAccountMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUser) =>
      fetchData<UserVO, UpdateUser>(API.USER.BASE, 'PUT', { data }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.getDetail(),
        refetchType: 'none',
      });
    },
  });
};

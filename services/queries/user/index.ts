import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

import { userKeys } from '@services/queries/user/keys';
import {
  getAdminUsersQueryOptions,
  getMyAccountQueryOptions,
} from '@services/queries/user/options';
import { fetchData } from '@services/utils/fetch';
import { API } from '@services/utils/path';
import { UserLoginType } from '@utils/constants/user';
import usePaginationQueryParams from '@utils/hooks/usePaginationQueryParams';
import { parseQueryParams } from '@utils/query/helper';

import type { SignInUser } from '@api/auth/sign-in/types/dto';
import type { CreateUser, UpdateUser } from '@api/user/types/dto';
import type { UserVO } from '@api/user/types/vo';

export const useMyAccountQuery = () => useQuery(getMyAccountQueryOptions());

export const useMyAccountWhenNewOrder = (enabled: boolean) =>
  useQuery({
    ...getMyAccountQueryOptions(),
    enabled,
    select: data => ({
      postCode: data.postCode,
      address: data.address,
      subAddress: data.subAddress,
      telephone: data.telephone,
    }),
    refetchOnMount: false,
  });

export const useSignUpMutation = () =>
  useMutation({
    mutationFn: (data: CreateUser) =>
      fetchData<UserVO, CreateUser>(API.USER.BASE, 'POST', {
        data: {
          ...data,
          loginType: UserLoginType.CREDENTIALS,
        },
      }),
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

export const useAdminUsersQuery = () => {
  const searchParams = useSearchParams();
  const queryParams = parseQueryParams(searchParams);
  const { paginationProps, handleSearchParamsChange } =
    usePaginationQueryParams();

  const { data, ...rest } = useQuery({
    ...getAdminUsersQueryOptions({
      searchParams: queryParams,
      page: paginationProps.currentPage,
      limit: paginationProps.currentLimit,
    }),
    placeholderData: keepPreviousData,
    enabled: !!searchParams,
  });

  return {
    data: data?.users || [],
    ...rest,
    paginationProps: {
      ...paginationProps,
      totalCount: data?.totalCount || 0,
    },
    handleSearchParamsChange,
  };
};

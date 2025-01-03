import { userKeys, userTags } from '@services/queries/user/keys';
import { fetchData } from '@services/utils/fetch';
import { API } from '@services/utils/path';
import { UserSortType } from '@utils/constants/user';
import { createQueryString } from '@utils/query/helper';

import type { AdminSearchUser } from '@api/admin/user/types/dto';
import type { AdminUserVO } from '@api/admin/user/types/vo';
import type { UserVO } from '@api/user/types/vo';
import type {
  PaginatedResponse,
  PaginationQueryParamsType,
} from '@services/utils/types/pagination';

export const getMyAccountQueryOptions = (headers?: HeadersInit) => ({
  queryKey: userKeys.getDetail(),
  queryFn: () =>
    fetchData<UserVO>(API.USER.BASE, 'GET', {
      headers,
      next: { tags: [userTags.all, userTags.detail] },
      cache: 'no-store',
    }),
  staleTime: Infinity,
  gcTime: Infinity,
});

export const getAdminUsersQueryOptions = ({
  searchParams,
  page,
  limit,
  headers,
}: {
  searchParams: PaginationQueryParamsType<AdminSearchUser>;
  page: number;
  limit: number;
  headers?: HeadersInit;
}) => ({
  queryKey: userKeys.getAdminAll({
    ...searchParams,
    page,
    limit,
    sort: searchParams.sort || UserSortType.NAME_ASC,
  }),
  queryFn: () =>
    fetchData<PaginatedResponse<'users', AdminUserVO>>(
      createQueryString(API.ADMIN.USER.BASE, {
        ...searchParams,
        page,
        limit,
        sort: searchParams.sort,
      }),
      'GET',
      { headers, next: { tags: [userTags.all, userTags.adminList] } },
    ),
});

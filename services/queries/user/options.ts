import { userKeys, userTags } from '@services/queries/user/keys';
import { fetchData } from '@services/utils/fetch';
import { API } from '@services/utils/path';

import type { UserVO } from '@api/user/types/vo';

export const getMyAccountQueryOptions = (headers?: HeadersInit) => ({
  queryKey: userKeys.getDetail(),
  queryFn: () =>
    fetchData<UserVO>(API.USER.BASE, 'GET', {
      headers,
      next: { tags: [userTags.all, userTags.detail] },
      cache: 'no-store',
    }),
  staleTime: Infinity,
  gcTime: 30 * 60 * 1000,
});

import type { AdminSearchUser } from '@api/admin/user/types/dto';
import type { PaginationQueryParamsType } from '@services/utils/types/pagination';

export const userKeys = {
  all: [{ entity: 'users' }] as const,
  // api 내부에서 session id 조회
  getDetail: () =>
    [
      {
        ...userKeys.all[0],
        scope: 'item',
      },
    ] as const,
  getAdminAll: (params?: PaginationQueryParamsType<AdminSearchUser>) =>
    [
      {
        ...userKeys.all[0],
        scope: 'admin-list',
        ...params,
      },
    ] as const,
  getAdminDetail: (userId: string) =>
    [
      {
        ...userKeys.all[0],
        scope: 'admin-item',
        userId,
      },
    ] as const,
};

export const userTags = {
  all: 'all-user',
  detail: 'user',
  adminList: 'admin-users',
  adminDetail: (id: string) => `admin-user-${id}`,
};

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
  getAdminAll: () =>
    [
      {
        ...userKeys.all[0],
        scope: 'admin-list',
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

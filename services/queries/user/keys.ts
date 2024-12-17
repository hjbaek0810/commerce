export const userKeys = {
  all: [{ entity: 'users' }] as const,
  getAll: () =>
    [
      {
        ...userKeys.all[0],
        scope: 'list',
      },
    ] as const,
  getDetail: (userId: string) =>
    [
      {
        ...userKeys.all[0],
        scope: 'item',
        userId,
      },
    ] as const,
};

export const userTags = {
  all: 'all-user',
  list: 'users',
  detail: (id?: string) => `user-${id}`,
};

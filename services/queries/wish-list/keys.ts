export const wishListKeys = {
  all: [{ entity: 'wish-list' }] as const,
  getAll: () =>
    [
      {
        ...wishListKeys.all[0],
        scope: 'list',
      },
    ] as const,
};

export const wishListTags = {
  all: 'all-wish',
  list: 'wish-list',
};

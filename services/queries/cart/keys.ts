export const cartKeys = {
  all: [{ entity: 'cart' }] as const,
  getAll: () =>
    [
      {
        ...cartKeys.all[0],
        scope: 'list',
      },
    ] as const,
};

export const cartTags = {
  all: 'all-cart',
  list: 'cart',
};

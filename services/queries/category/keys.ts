export const categoryKeys = {
  all: [{ entity: 'categories' }] as const,
  getAll: () =>
    [
      {
        ...categoryKeys.all[0],
        scope: 'list',
      },
    ] as const,
  getAdminAll: () =>
    [
      {
        ...categoryKeys.all[0],
        scope: 'admin-list',
      },
    ] as const,
  getAdminDetail: (categoryId: string) =>
    [
      {
        ...categoryKeys.all[0],
        scope: 'admin-item',
        categoryId,
      },
    ] as const,
};

export const categoryTags = {
  all: 'all-category',
  list: 'categories',
  adminList: 'admin-categories',
  adminDetail: (id: string) => `admin-category-${id}`,
};

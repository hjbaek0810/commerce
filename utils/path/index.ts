const ADMIN_HOME = '/admin';
const PRODUCT = '/product';

export const PATH = {
  ADMIN: {
    HOME: ADMIN_HOME,
    CATEGORY: ADMIN_HOME + '/category',
    PRODUCT: {
      LIST: ADMIN_HOME + PRODUCT,
      REGISTER: ADMIN_HOME + PRODUCT + '/register',
      DETAIL: (productId: string) => ADMIN_HOME + PRODUCT + `/${productId}`,
    },
  },
};

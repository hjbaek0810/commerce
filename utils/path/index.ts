const ADMIN_HOME = '/admin';
const PRODUCT = '/product';

export const PATH = {
  SIGN_IN: '/auth/sign-in',
  ADMIN: {
    HOME: ADMIN_HOME,
    CATEGORY: ADMIN_HOME + '/category',
    PRODUCT: {
      LIST: ADMIN_HOME + PRODUCT,
      REGISTER: ADMIN_HOME + PRODUCT + '/register',
      DETAIL: (productId: string) => ADMIN_HOME + PRODUCT + `/${productId}`,
    },
  },
  PRODUCT: {
    LIST: PRODUCT,
    DETAIL: (productId: string) => PRODUCT + `/${productId}`,
  },
  WISH_LIST: '/wish-list',
  CART: '/cart',
  NEW_ORDER: '/new-order',
  ORDER: '/order',
};

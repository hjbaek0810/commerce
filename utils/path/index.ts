const ADMIN_HOME = '/admin';
const PRODUCT = '/product';
const ORDER = '/order';

export const PATH = {
  SIGN_IN: '/auth/sign-in',
  SIGN_UP: '/sign-up',
  ADMIN: {
    HOME: ADMIN_HOME,
    CATEGORY: ADMIN_HOME + '/category',
    PRODUCT: {
      LIST: ADMIN_HOME + PRODUCT,
      REGISTER: ADMIN_HOME + PRODUCT + '/register',
      DETAIL: (productId: string) => ADMIN_HOME + PRODUCT + `/${productId}`,
    },
    ORDER: {
      LIST: ADMIN_HOME + ORDER,
      DETAIL: (orderId: string) => ADMIN_HOME + ORDER + `/${orderId}`,
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
  MY_ACCOUNT: '/my-account',
};

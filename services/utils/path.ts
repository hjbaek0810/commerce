export const API = {
  AUTH: {
    BASE: 'auth',
    SIGN_IN: 'auth/sign-in',
  },
  USER: {
    BASE: 'user',
  },
  ADMIN: {
    CATEGORY: 'admin/category',
    PRODUCT: {
      BASE: 'admin/product',
      DETAIL: (productId: string) => `admin/product/${productId}`,
    },
    ORDER: {
      BASE: 'admin/order',
      DETAIL: (orderId: string) => `admin/order/${orderId}`,
    },
    USER: {
      BASE: 'admin/user',
    },
  },
  CATEGORY: {
    BASE: 'category',
  },
  PRODUCT: {
    BASE: 'product',
    DETAIL: (productId: string) => `product/${productId}`,
  },
  WISH_LIST: {
    BASE: 'wish-list',
  },
  CART: {
    BASE: 'cart',
  },
  ORDER: {
    BASE: 'order',
  },
};

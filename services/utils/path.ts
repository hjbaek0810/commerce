export const API = {
  AUTH: {
    BASE: 'auth',
    SIGN_IN: 'auth/sign-in',
  },
  ADMIN: {
    CATEGORY: 'admin/category',
    PRODUCT: {
      BASE: 'admin/product',
      DETAIL: (productId: string) => `admin/product/${productId}`,
    },
  },
  CATEGORY: 'category',
  PRODUCT: {
    BASE: 'product',
    DETAIL: (productId: string) => `product/${productId}`,
  },
};
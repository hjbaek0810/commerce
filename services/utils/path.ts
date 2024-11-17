export const API = {
  CATEGORY: 'category',
  PRODUCT: {
    BASE: 'product',
    DETAIL: (productId: string) => `product/${productId}`,
  },
};

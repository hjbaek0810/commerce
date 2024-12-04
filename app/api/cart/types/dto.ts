export type UpdateCartItem = {
  productId: string;
  quantity: number;
};

export type DeleteCartItems = {
  productIds: Array<string>;
};

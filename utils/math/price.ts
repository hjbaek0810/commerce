export const calculatePrice = (
  price: number,
  salePrice: number | null,
  quantity: number,
) => {
  const realPrice = salePrice || price;

  return realPrice * quantity;
};

export const calculateTotalPrice = (
  price: number[],
  salePrice: (number | null)[],
  quantities: number[],
): number => {
  return price
    .map((_, index) => {
      const realPrice = salePrice[index] ?? price[index];

      return realPrice * quantities[index];
    })
    .reduce((total, price) => total + price, 0);
};

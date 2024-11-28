export const calculateSaleRate = (origin: number, sale?: number) => {
  if (!sale || sale < 0 || origin < 0 || sale > origin) return '0%';

  const discountRate = ((origin - sale) / origin) * 100;

  return `${Math.round(discountRate)}%`;
};

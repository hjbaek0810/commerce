export enum ProductStatusType {
  IN_PROGRESS = 'IN_PROGRESS',
  STOPPED = 'STOPPED',
  HIDDEN = 'HIDDEN',
}

export enum ProductSortType {
  NEWEST = 'NEWEST',
  OLDEST = 'OLDEST',
  POPULARITY = 'POPULARITY',
  PRICE_HIGH = 'PRICE_HIGH',
  PRICE_LOW = 'PRICE_LOW',
}

export const getProductStatusText = (status: ProductStatusType) => {
  switch (status) {
    case ProductStatusType.IN_PROGRESS:
      return '판매';
    case ProductStatusType.STOPPED:
      return '판매 중지';
    case ProductStatusType.HIDDEN:
      return '상품 숨김';
    default:
      return '';
  }
};

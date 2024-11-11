export type CreateProduct = {
  name: string;
  price: number;
  salePrice?: number;
  categoryId?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'STOPPED';
  images?: Array<{
    publicId: string;
    secureUrl: string;
  }>;
};

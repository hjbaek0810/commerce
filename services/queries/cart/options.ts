import { fetchData } from '@services/utils/fetch';
import { API } from '@services/utils/path';

import type { CartListVO } from '@api/cart/types/vo';

export const getCartListQueryOptions = (headers?: HeadersInit) => ({
  queryKey: [
    'cart',
    { scope: 'list' },
    { categories: ['product', 'order'], action: 'update' },
  ],
  queryFn: () =>
    fetchData<CartListVO>(API.CART.BASE, 'GET', {
      headers,
    }),
});

import { fetchData } from '@services/utils/fetch';
import { API } from '@services/utils/path';

import type { CartListVO } from '@api/cart/types/vo';

export const CART_QUERY_KEY = ['cart', { scope: 'list' }];

export const getCartListQueryOptions = (headers?: HeadersInit) => ({
  queryKey: CART_QUERY_KEY,
  queryFn: () =>
    fetchData<CartListVO>(API.CART.BASE, 'GET', {
      headers,
    }),
});

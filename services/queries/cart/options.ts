import { cartKeys, cartTags } from '@services/queries/cart/keys';
import { fetchData } from '@services/utils/fetch';
import { API } from '@services/utils/path';

import type { CartListVO } from '@api/cart/types/vo';

export const getCartListQueryOptions = (headers?: HeadersInit) => ({
  queryKey: cartKeys.getAll(),
  queryFn: () =>
    fetchData<CartListVO>(API.CART.BASE, 'GET', {
      headers,
      next: { tags: [cartTags.all, cartTags.list] },
      cache: 'no-store',
    }),
});

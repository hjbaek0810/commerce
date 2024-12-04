import { fetchData } from '@services/utils/fetch';
import { API } from '@services/utils/path';

import type { CartListVO } from '@api/cart/types/vo';

export const getCartListQueryOptions = () => ({
  queryKey: ['cart', 'product'],
  queryFn: () => fetchData<CartListVO>(API.CART.BASE, 'GET'),
});

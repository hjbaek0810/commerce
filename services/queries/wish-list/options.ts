import { fetchData } from '@services/utils/fetch';
import { API } from '@services/utils/path';

import type { WishListVO } from '@api/wish-list/types/vo';

export const getWishListQueryOptions = () => ({
  queryKey: ['wish-list', 'product'],
  queryFn: () => fetchData<WishListVO>(API.WISH_LIST.BASE, 'GET'),
});

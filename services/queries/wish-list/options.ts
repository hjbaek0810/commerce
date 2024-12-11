import { fetchData } from '@services/utils/fetch';
import { API } from '@services/utils/path';

import type { WishListVO } from '@api/wish-list/types/vo';

export const getWishListQueryOptions = (headers?: HeadersInit) => ({
  queryKey: ['wish-list', { scope: 'list' }],
  queryFn: () => fetchData<WishListVO>(API.WISH_LIST.BASE, 'GET', { headers }),
});

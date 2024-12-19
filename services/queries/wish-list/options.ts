import { wishListKeys, wishListTags } from '@services/queries/wish-list/keys';
import { fetchData } from '@services/utils/fetch';
import { API } from '@services/utils/path';

import type { WishListVO } from '@api/wish-list/types/vo';

export const getWishListQueryOptions = (headers?: HeadersInit) => ({
  queryKey: wishListKeys.getAll(),
  queryFn: () =>
    fetchData<WishListVO>(API.WISH_LIST.BASE, 'GET', {
      headers,
      next: { tags: [wishListTags.all, wishListTags.list] },
      cache: 'no-store',
    }),
});

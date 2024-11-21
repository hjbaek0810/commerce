import { useSearchParams } from 'next/navigation';

import { useCategoriesQuery } from '@services/queries/category';
import { PATH } from '@utils/path';

import type { HeaderListType } from '@components/Header';
import type { SideMenuListType } from '@components/SideMenu';

type MenuListType = {
  headers: HeaderListType;
  subMenus: SideMenuListType[];
};

const useMenu = () => {
  const { data: menus } = useCategoriesQuery();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('category');

  const MENU_LIST: MenuListType[] = menus.map(main => {
    return {
      headers: {
        title: main.name,
        href: {
          path: PATH.PRODUCT.LIST,
          query: { category: main._id },
        },
      },
      subMenus: main.subCategories.map(sub => {
        return {
          title: sub.name,
          href: {
            path: PATH.PRODUCT.LIST,
            query: { category: main._id, subCategory: sub._id },
          },
        };
      }),
    };
  });

  const headers: HeaderListType[] = MENU_LIST.map(menu => menu.headers);

  const subMenus: SideMenuListType[] = MENU_LIST.flatMap(menu => {
    const query = menu.headers.href?.query as { category?: string };
    const activeCategory = query?.category;

    const allMenu: SideMenuListType = {
      title: 'All',
      href: {
        path: PATH.PRODUCT.LIST,
        query: { category: activeCategory },
      },
    };

    return activeCategory !== selectedCategory
      ? []
      : [allMenu, ...menu.subMenus];
  });

  return { headers, subMenus };
};

export default useMenu;

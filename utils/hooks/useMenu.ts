import { usePathname, useSearchParams } from 'next/navigation';

import { useCategoriesQuery } from '@services/queries/category';
import { PATH } from '@utils/path';

import type { HeaderListType } from '@components/Header';
import type { SideMenuListType } from '@components/SideMenu';

type MenuListType = {
  headers: HeaderListType;
  subMenus: SideMenuListType[];
};

const useMenu = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { data: menus } = useCategoriesQuery();

  const showSideBar = pathname.startsWith('/product');

  const selectedCategory = searchParams.get('category');

  // 카테고리 메뉴 생성
  const MENU_LIST: MenuListType[] = menus.map(main => ({
    headers: {
      title: main.name,
      href: {
        path: PATH.PRODUCT.LIST,
        query: { category: main._id },
      },
    },
    subMenus: main.subCategories.map(sub => ({
      title: sub.name,
      href: {
        path: PATH.PRODUCT.LIST,
        query: { category: main._id, subCategory: sub._id },
      },
    })),
  }));

  // 헤더 메뉴 생성
  const headers: HeaderListType[] = [
    {
      title: 'ALL',
      href: {
        path: PATH.PRODUCT.LIST,
      },
      customSelected:
        !selectedCategory && pathname.startsWith(PATH.PRODUCT.LIST),
    },
    ...MENU_LIST.map(menu => menu.headers),
  ];

  // 사이드 메뉴 생성
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

    return activeCategory === selectedCategory
      ? [allMenu, ...menu.subMenus]
      : [];
  });

  return { headers, subMenus, showSideBar };
};

export default useMenu;

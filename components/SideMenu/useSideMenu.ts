import { isEqual } from 'lodash-es';
import { usePathname, useSearchParams } from 'next/navigation';

import type { ParsedUrlQueryInput } from 'querystring';

const useSideMenu = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filterKeys = ['category', 'subCategory'];

  const newParams: Record<string, string> = {};

  filterKeys.forEach(key => {
    const value = searchParams.get(key);
    if (value) {
      newParams[key] = value;
    }
  });

  const selected = (menuPath: string, query?: ParsedUrlQueryInput | string) => {
    if (!query) {
      if (menuPath === '/' || menuPath === '/admin')
        return menuPath === pathname;

      return pathname.startsWith(menuPath);
    }

    return pathname.startsWith(menuPath) && isEqual(newParams, query);
  };

  return { selected };
};

export default useSideMenu;

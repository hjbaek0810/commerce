import { isEqual } from 'lodash-es';
import { usePathname, useSearchParams } from 'next/navigation';

import type { ParsedUrlQueryInput } from 'querystring';

const useSideMenu = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const removeParams = (paramsToRemove: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    paramsToRemove.forEach(param => {
      params.delete(param);
    });

    return Object.fromEntries(params.entries());
  };

  const selected = (menuPath: string, query?: ParsedUrlQueryInput | string) => {
    if (!query) {
      return menuPath === pathname;
    }

    const newParams = removeParams(['page', 'limit', 'sort']);

    return pathname.startsWith(menuPath) && isEqual(newParams, query);
  };

  return { selected };
};

export default useSideMenu;

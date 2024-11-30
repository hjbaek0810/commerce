import { isBoolean } from 'lodash-es';
import { usePathname, useSearchParams } from 'next/navigation';

import type { ParsedUrlQueryInput } from 'querystring';

const useHeader = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selected = (
    menuPath: string,
    query?: ParsedUrlQueryInput | string,
    customSelected?: boolean,
  ) => {
    if (isBoolean(customSelected)) return customSelected;

    if (!query) {
      return pathname.startsWith(menuPath);
    }

    const queryParams = new URLSearchParams(query as string);

    const currentQuery = searchParams.toString();

    const menuQuery = queryParams.toString();

    return pathname.startsWith(menuPath) && currentQuery.startsWith(menuQuery);
  };

  return { selected };
};

export default useHeader;

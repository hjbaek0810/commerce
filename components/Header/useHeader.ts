import { usePathname, useSearchParams } from 'next/navigation';

import type { ParsedUrlQueryInput } from 'querystring';

const useHeader = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selected = (
    menuPath: string,
    query?: ParsedUrlQueryInput | string,
    fullMatch?: boolean,
  ) => {
    if (!query && !fullMatch) {
      return pathname.startsWith(menuPath);
    }

    const queryParams = new URLSearchParams(query as string);

    const currentFullPath = `${pathname}?${searchParams.toString()}`;
    const menuFullPath = `${menuPath}?${queryParams}`;

    if (fullMatch) {
      return currentFullPath === menuFullPath;
    }

    return currentFullPath.startsWith(menuFullPath);
  };

  return { selected };
};

export default useHeader;

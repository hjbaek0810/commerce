import { useCallback } from 'react';

import { usePathname, useSearchParams } from 'next/navigation';

import { type NewObject } from '@utils/types/utility';

const useQueryParams = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const changeSearchParams = useCallback(
    (newParams: NewObject) => {
      const params = new URLSearchParams(searchParams);

      Object.entries(newParams).forEach(([key, value]) => {
        if (value) {
          params.set(key, String(value));
        } else {
          params.delete(key);
        }
      });

      window.history.replaceState(null, '', `${pathname}?${params.toString()}`);
    },
    [pathname, searchParams],
  );

  return {
    changeSearchParams,
  };
};

export default useQueryParams;

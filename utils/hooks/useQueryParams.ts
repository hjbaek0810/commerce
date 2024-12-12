import { useCallback } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { type NewObject } from '@utils/types/utility';

const useQueryParams = () => {
  const { replace } = useRouter();
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

      replace(`${pathname}?${params.toString()}`);
    },
    [pathname, replace, searchParams],
  );

  return {
    changeSearchParams,
  };
};

export default useQueryParams;

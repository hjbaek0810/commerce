import type { SetStateAction } from 'react';
import { useCallback, useEffect, useState } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { type NewObject } from '@utils/types/utility';

const INITIAL_PAGE_NUMBER = 1;
const INITIAL_LIMIT_COUNT = 10;

const useQueryPagination = () => {
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get('page')) || INITIAL_PAGE_NUMBER,
  );
  const [currentLimit, setCurrentLimit] = useState(
    Number(searchParams.get('limit')) || INITIAL_LIMIT_COUNT,
  );

  useEffect(() => {
    const page = Number(searchParams.get('page')) || INITIAL_PAGE_NUMBER;
    const limit = Number(searchParams.get('limit')) || INITIAL_LIMIT_COUNT;

    if (page !== currentPage) {
      setCurrentPage(page);
    }

    if (limit !== currentLimit) {
      setCurrentLimit(limit);
    }
  }, [currentLimit, currentPage, searchParams]);

  // URL 파라미터가 없으면 기본값 설정 (초기화)
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const page = params.get('page');
    const limit = params.get('limit');

    if (!page || !limit) {
      if (!page) params.set('page', String(INITIAL_PAGE_NUMBER));
      if (!limit) params.set('limit', String(INITIAL_LIMIT_COUNT));

      replace(`${pathname}?${params.toString()}`);
    }
  }, [pathname, replace, searchParams]);

  // searchParams 변경 시 URL을 갱신
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
    [searchParams, pathname, replace],
  );

  const handlePageChange = (page: SetStateAction<number>) => {
    changeSearchParams({
      page,
      limit: currentLimit,
    });
  };

  const handlePageSizeChange = (size: SetStateAction<number>) => {
    changeSearchParams({ page: 1, limit: size });
  };

  return {
    paginationProps: {
      onPageChange: handlePageChange,
      onPageSizeChange: handlePageSizeChange,
      currentPage,
      currentLimit,
    },
  };
};

export default useQueryPagination;

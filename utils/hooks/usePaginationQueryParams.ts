import type { SetStateAction } from 'react';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';

import { usePathname, useSearchParams } from 'next/navigation';

import useQueryParams from '@utils/hooks/useQueryParams';
import { type NewObject } from '@utils/types/utility';

const INITIAL_PAGE_NUMBER = 1;
const INITIAL_LIMIT_COUNT = 10;

const getDefaultParams = () => ({
  page: Number(INITIAL_PAGE_NUMBER),
  limit: Number(INITIAL_LIMIT_COUNT),
});

const usePaginationQueryParams = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { changeSearchParams } = useQueryParams();
  const { page, limit } = getDefaultParams();

  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get('page')) || page,
  );
  const [currentLimit, setCurrentLimit] = useState(
    Number(searchParams.get('limit')) || limit,
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

  // URL 파라미터 가져오기
  const getQueryParams = useCallback(() => {
    const params = new URLSearchParams(searchParams);

    return {
      params,
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
    };
  }, [searchParams]);

  // URL 파라미터가 없으면 기본값 설정 (초기화)
  useLayoutEffect(() => {
    const { params, page: pageParam, limit: limitParam } = getQueryParams();

    if (!pageParam || !limitParam) {
      if (!pageParam) params.set('page', String(page));
      if (!limitParam) params.set('limit', String(limit));

      window.history.replaceState(null, '', `${pathname}?${params.toString()}`);
    }
  }, [getQueryParams, limit, page, pathname, searchParams]);

  const handlePageChange = (pageNumber: SetStateAction<number>) => {
    changeSearchParams({
      page: pageNumber,
      limit: currentLimit,
    });
  };

  const handlePageSizeChange = (size: SetStateAction<number>) => {
    const { page } = getDefaultParams();

    changeSearchParams({
      page,
      limit: size,
    });
  };

  const handleSearchParamsChange = useCallback(
    (params: NewObject) => {
      const { page, limit } = getDefaultParams();

      changeSearchParams({
        ...params,
        page,
        limit: searchParams.get('limit') || limit,
      });
    },
    [changeSearchParams, searchParams],
  );

  return {
    handleSearchParamsChange,
    paginationProps: {
      onPageChange: handlePageChange,
      onPageSizeChange: handlePageSizeChange,
      currentPage,
      currentLimit,
    },
  };
};

export default usePaginationQueryParams;

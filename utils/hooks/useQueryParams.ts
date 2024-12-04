import type { SetStateAction } from 'react';
import { useCallback, useEffect, useState } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { ProductSortType } from '@utils/constants/product';
import { type NewObject } from '@utils/types/utility';

const INITIAL_PAGE_NUMBER = 1;
const INITIAL_LIMIT_COUNT = 10;
const INITIAL_SORT_VALUE = ProductSortType.NEWEST;

const getDefaultParams = () => ({
  page: Number(INITIAL_PAGE_NUMBER),
  limit: Number(INITIAL_LIMIT_COUNT),
  sort: INITIAL_SORT_VALUE,
});

const useQueryParams = () => {
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { page, limit, sort } = getDefaultParams();

  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get('page')) || page,
  );
  const [currentLimit, setCurrentLimit] = useState(
    Number(searchParams.get('limit')) || limit,
  );
  const [currentSort, setCurrentSort] = useState(
    searchParams.get('sort') || sort,
  );

  useEffect(() => {
    const page = Number(searchParams.get('page')) || INITIAL_PAGE_NUMBER;
    const limit = Number(searchParams.get('limit')) || INITIAL_LIMIT_COUNT;
    const sort = searchParams.get('sort') || INITIAL_SORT_VALUE;

    if (page !== currentPage) {
      setCurrentPage(page);
    }

    if (limit !== currentLimit) {
      setCurrentLimit(limit);
    }

    if (sort !== currentSort) {
      setCurrentSort(sort);
    }
  }, [currentLimit, currentPage, currentSort, searchParams]);

  // URL 파라미터 가져오기
  const getQueryParams = useCallback(() => {
    const params = new URLSearchParams(searchParams);

    return {
      params,
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      sort: searchParams.get('sort'),
    };
  }, [searchParams]);

  // URL 파라미터가 없으면 기본값 설정 (초기화)
  useEffect(() => {
    const {
      params,
      page: pageParam,
      limit: limitParam,
      sort: sortParam,
    } = getQueryParams();

    if (!pageParam || !limitParam || !sortParam) {
      if (!pageParam) params.set('page', String(page));
      if (!limitParam) params.set('limit', String(limit));
      if (!sortParam) params.set('sort', sort);

      replace(`${pathname}?${params.toString()}`);
    }
  }, [getQueryParams, limit, page, pathname, replace, searchParams, sort]);

  // searchParams 변경 시 URL을 갱신
  const changeSearchParams = useCallback(
    (newParams: NewObject) => {
      const { params } = getQueryParams();

      Object.entries(newParams).forEach(([key, value]) => {
        if (value) {
          params.set(key, String(value));
        } else {
          params.delete(key);
        }
      });

      replace(`${pathname}?${params.toString()}`);
    },
    [getQueryParams, pathname, replace],
  );

  const handlePageChange = (pageNumber: SetStateAction<number>) => {
    const { sort } = getDefaultParams();

    changeSearchParams({
      page: pageNumber,
      limit: currentLimit,
      sort: searchParams.get('sort') || sort,
    });
  };

  const handlePageSizeChange = (size: SetStateAction<number>) => {
    const { page, sort } = getDefaultParams();

    changeSearchParams({
      page,
      limit: size,
      sort: searchParams.get('sort') || sort,
    });
  };

  const handleSearchParamsChange = useCallback(
    (params: NewObject) => {
      const { page, limit, sort } = getDefaultParams();

      changeSearchParams({
        ...params,
        page,
        limit: searchParams.get('limit') || limit,
        sort: params?.sort || searchParams.get('sort') || sort,
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

export default useQueryParams;

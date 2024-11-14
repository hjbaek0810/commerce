import { useCallback, useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { fetchData } from '@api/utils/fetch';
import { API } from '@api/utils/path';
import { createQueryString } from '@api/utils/query';
import { ProductStatusType } from '@api/utils/types/enum';
import useQueryPagination from '@utils/hooks/useQueryPagination';
import { PATH } from '@utils/path';

import type { ProductVO } from '@api/product/types/vo';
import type { PaginatedResponse } from '@api/utils/types/pagination';

type ProductsType = PaginatedResponse<'products', ProductVO>;

const useProductList = () => {
  const [products, setProducts] = useState<ProductsType>();
  const { paginationProps } = useQueryPagination();
  const router = useRouter();

  const fetchProducts = useCallback(() => {
    fetchData<ProductsType>(
      createQueryString(API.PRODUCT.BASE, {
        page: paginationProps.currentPage,
        limit: paginationProps.currentLimit,
      }),
      'GET',
    ).then(data => setProducts(data));
  }, [paginationProps.currentPage, paginationProps.currentLimit]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const getStatusLabel = (status: ProductStatusType) => {
    switch (status) {
      case ProductStatusType.PENDING:
        return '대기';
      case ProductStatusType.IN_PROGRESS:
        return '진행';
      case ProductStatusType.STOPPED:
        return '정지';
      default:
        return '';
    }
  };

  const handleTableRowClick = (id: string) => {
    router.push(PATH.ADMIN.PRODUCT.DETAIL(id));
  };

  return {
    paginationProps: {
      ...paginationProps,
      totalCount: products?.totalCount || 0,
    },
    products: products?.products || [],
    getStatusLabel,
    handleTableRowClick,
  };
};

export default useProductList;

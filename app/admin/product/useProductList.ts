import { useProductListQuery } from '@queries/product';
import { useRouter } from 'next/navigation';

import { ProductStatusType } from '@api/utils/types/status';
import { PATH } from '@utils/path';

const useProductList = () => {
  const router = useRouter();
  const { data: products, paginationProps } = useProductListQuery();

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
    paginationProps,
    products: products,
    getStatusLabel,
    handleTableRowClick,
  };
};

export default useProductList;

import { useRouter } from 'next/navigation';

import { useAdminProductListQuery } from '@services/queries/product';
import { ProductStatusType } from '@utils/constants/product';
import { PATH } from '@utils/path';

const useAdminProductList = () => {
  const router = useRouter();
  const { data: products, paginationProps } = useAdminProductListQuery();

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

export default useAdminProductList;

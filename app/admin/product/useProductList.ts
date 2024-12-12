import { useRouter } from 'next/navigation';

import { useAdminProductListQuery } from '@services/queries/product';
import { ProductStatusType } from '@utils/constants/product';
import { PATH } from '@utils/path';

const useAdminProductList = () => {
  const router = useRouter();
  const { data: products, paginationProps } = useAdminProductListQuery();

  const handleTableRowClick = (id: string) => {
    router.push(PATH.ADMIN.PRODUCT.DETAIL(id));
  };

  return {
    paginationProps,
    products: products,
    handleTableRowClick,
  };
};

export default useAdminProductList;

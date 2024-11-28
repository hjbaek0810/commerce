import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

import Button from '@components/Button';
import Title from '@components/Title';
import { sprinkles } from '@styles/sprinkles.css';
import { PATH } from '@utils/path';
import AdminProductListTable from 'app/admin/product/AdminProductListTable';

const ProductList = () => {
  // TODO: 필터 검색 기능

  return (
    <>
      <Title>상품 목록</Title>
      <AdminProductListTable />

      <Link
        href={PATH.ADMIN.PRODUCT.REGISTER}
        className={sprinkles({
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: 'spacing-auto',
        })}
      >
        <Button size="large" fill>
          <FontAwesomeIcon icon={faPlus} />
        </Button>
      </Link>
    </>
  );
};

export default ProductList;

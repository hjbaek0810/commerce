'use client';

import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import AdminProductGrid from '@app/admin/product/AdminProductView/AdminProductGrid';
import AdminProductSearchFilter from '@app/admin/product/AdminProductView/AdminProductSearchFilter';
import useAdminProductView from '@app/admin/product/AdminProductView/useAdminProductView';
import Button from '@components/Button';
import Title from '@components/Title';

import * as css from '../adminProduct.css';

const AdminProductView = () => {
  const {
    searchFilterProps,
    resultProps,
    handleGoToProductRegisterButtonClick,
  } = useAdminProductView();

  return (
    <>
      <Title>Product List</Title>

      <div className={css.wrapper}>
        <AdminProductSearchFilter {...searchFilterProps} />

        <div>
          <AdminProductGrid {...resultProps} />
        </div>

        <Button
          size="large"
          fill
          onClick={handleGoToProductRegisterButtonClick}
        >
          <FontAwesomeIcon icon={faPlus} />
        </Button>
      </div>
    </>
  );
};

export default AdminProductView;

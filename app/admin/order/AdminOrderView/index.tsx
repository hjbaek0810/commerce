'use client';

import AdminOrderGrid from '@app/admin/order/AdminOrderView/AdminOrderGrid';
import AdminOrderSearchFilter from '@app/admin/order/AdminOrderView/AdminOrderSearchFilter';
import useAdminOrderView from '@app/admin/order/AdminOrderView/useAdminOrderView';
import Title from '@components/Title';

import * as css from '../adminOrder.css';

const AdminOrderView = () => {
  const { searchFilterProps, resultProps } = useAdminOrderView();

  return (
    <>
      <Title>Orders</Title>
      <div className={css.orderWrapper}>
        <AdminOrderSearchFilter {...searchFilterProps} />
        <div>
          <AdminOrderGrid {...resultProps} />
        </div>
      </div>
    </>
  );
};

export default AdminOrderView;

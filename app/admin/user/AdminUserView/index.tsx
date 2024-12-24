'use client';

import AdminUserGrid from '@app/admin/user/AdminUserView/AdminUserGrid';
import AdminUserSearchFilter from '@app/admin/user/AdminUserView/AdminUserSearchFilter';
import useAdminUserView from '@app/admin/user/AdminUserView/useAdminUserView';
import Title from '@components/Title';

import * as css from '../adminUser.css';

const AdminUserView = () => {
  const { searchFilterProps, resultProps } = useAdminUserView();

  return (
    <>
      <Title>Users</Title>
      <div className={css.wrapper}>
        <AdminUserSearchFilter {...searchFilterProps} />
        <div>
          <AdminUserGrid {...resultProps} />
        </div>
      </div>
    </>
  );
};

export default AdminUserView;

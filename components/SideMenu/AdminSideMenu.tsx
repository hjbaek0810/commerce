'use client';

import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import SideMenu from '@components/SideMenu';
import useSignOut from '@utils/hooks/useSignOut';
import { PATH } from '@utils/path';

import * as css from './sideMenu.css';

import type { SideMenuListType } from '@components/SideMenu';

const ADMIN_LIST: Array<SideMenuListType> = [
  {
    title: 'Home',
    href: {
      path: PATH.ADMIN.HOME,
    },
  },
  {
    title: 'Categories',
    href: {
      path: PATH.ADMIN.CATEGORY,
    },
  },
  {
    title: 'Products',
    href: {
      path: PATH.ADMIN.PRODUCT.LIST,
    },
  },
  {
    title: 'Orders',
    href: {
      path: PATH.ADMIN.ORDER.LIST,
    },
  },
  {
    title: 'Users',
    href: {
      path: PATH.ADMIN.USER.LIST,
    },
  },
];

const AdminSideMenu = () => {
  const { session, handleSignOutButtonClick } = useSignOut();

  return (
    <SideMenu list={ADMIN_LIST}>
      {session && (
        <button
          type="button"
          className={css.logoutButton}
          onClick={handleSignOutButtonClick}
        >
          <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
      )}
    </SideMenu>
  );
};

export default AdminSideMenu;

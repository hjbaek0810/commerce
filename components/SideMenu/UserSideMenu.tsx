'use client';

import SideMenu from '@components/SideMenu';
import useMenu from '@utils/hooks/useMenu';

const UserSideMenu = () => {
  const { subMenus, showSideBar } = useMenu();

  return <SideMenu isHide={!showSideBar} list={subMenus} />;
};

export default UserSideMenu;

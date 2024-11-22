'use client';

import SideMenu from '@components/SideMenu';
import useMenu from '@utils/hooks/useMenu';

const UserSideMenu = () => {
  const { subMenus, isHome } = useMenu();

  return <SideMenu isHide={isHome} list={subMenus} />;
};

export default UserSideMenu;

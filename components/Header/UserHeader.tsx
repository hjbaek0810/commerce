'use client';

import Header from '@components/Header';
import useMenu from '@utils/hooks/useMenu';

const UserHeader = () => {
  const { headers } = useMenu();

  return <Header list={headers} />;
};

export default UserHeader;

import Outlet from '@components/Layout/Outlet';
import { SIDE_MENU_WIDTH } from '@components/SideMenu/sideMenu.css';

import Banner from './sections/Banner';

const Home = () => {
  console.log('hi');

  return (
    <>
      <article
        style={{
          paddingLeft: SIDE_MENU_WIDTH,
        }}
      >
        <Banner />
      </article>
      <Outlet
        style={{
          height: 'auto',
        }}
      >
        <h1>Home!!</h1>
      </Outlet>
    </>
  );
};

export default Home;

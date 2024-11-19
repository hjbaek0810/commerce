import Banner from './sections/Banner';
import { SIDE_MENU_WIDTH } from '@components/SideMenu/sideMenu.css';

import Outlet from '@components/Layout/Outlet';

const Home = () => {
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
        <h1>Home@</h1>
      </Outlet>
      {/* <section className={css.outlet}>
        <h1>Home!</h1>
      </section> */}
    </>
  );
};

export default Home;

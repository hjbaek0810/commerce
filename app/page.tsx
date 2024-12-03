import Outlet from '@components/Layout/Outlet';
import { sprinkles } from '@styles/sprinkles.css';

import Banner from './sections/Banner';

const Home = () => {
  return (
    <>
      <article>
        <Banner />
      </article>
      <Outlet>
        <h1>Home!!</h1>
      </Outlet>
    </>
  );
};

export default Home;

import { sprinkles } from '@styles/sprinkles.css';

import Banner from './sections/Banner';

const Home = () => {
  return (
    <>
      <article>
        <Banner />
      </article>
      <section
        className={sprinkles({
          width: 'sizing-fill',
          height: 'sizing-auto',
          paddingX: 'spacing-024',
          paddingY: 'spacing-032',
        })}
      >
        <h1>Home!!</h1>
      </section>
    </>
  );
};

export default Home;

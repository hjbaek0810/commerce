'use client';

import Head from 'next/head';

import Slider from '@components/Slider';

// TODO
const imgInfo = [
  {
    src: 'https://picsum.photos/id/1011/1024/600',
    alt: '',
    redirectTo: '/',
  },
  {
    src: 'https://picsum.photos/id/1012/1024/600',
    alt: '',
    redirectTo: '/',
  },
  {
    src: 'https://picsum.photos/id/1013/1024/600',
    alt: '',
    redirectTo: '/',
  },
];

const Banner = () => (
  <>
    {/* ssr example */}
    <Head>
      <meta
        property="og:url"
        content="http://www.nytimes.com/2015/02/19/arts/international/when-great-minds-dont-think-alike.html"
      />
      <meta property="og:type" content="article" />
      <meta property="og:title" content="When Great Minds Don’t Think Alike" />
      <meta
        property="og:description"
        content="How much does culture influence creative thinking?"
      />
      <meta
        property="og:image"
        content="http://static01.nyt.com/images/2015/02/19/arts/international/19iht-btnumbers19A/19iht-btnumbers19A-facebookJumbo-v2.jpg"
      />
    </Head>
    <Slider type="fade" height="sizing-640" width="sizing-1024">
      <Slider.List>
        {imgInfo.map((item, index) => (
          <Slider.Item key={index}>
            <Slider.ClickableImage
              src={item.src}
              alt={item.alt}
              redirectTo={item.redirectTo}
            />
          </Slider.Item>
        ))}
      </Slider.List>
    </Slider>
  </>
);

export default Banner;

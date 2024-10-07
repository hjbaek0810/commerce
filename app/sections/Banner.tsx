'use client';

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
);

export default Banner;

'use client';

import Slider from '@components/Slider';

const imgInfo = [
  {
    src: '/assets/banner1.png',
    alt: 'welcome to 2025 한정 혜택 이벤트 진행 중',
  },
  {
    src: '/assets/banner2.png',
    alt: 'ELEVATE YOUR STYLE WITH FUTURISTIC DESIGN BOUNDLESS CREATIVITY',
  },
  {
    src: '/assets/banner3.png',
    alt: 'Minimal Yet Powerful',
  },
];

const Banner = () => (
  <Slider type="fade" height="40vw">
    <Slider.List>
      {imgInfo.map((item, index) => (
        <Slider.Item key={index}>
          <Slider.ClickableImage src={item.src} alt={item.alt} />
        </Slider.Item>
      ))}
    </Slider.List>
  </Slider>
);

export default Banner;

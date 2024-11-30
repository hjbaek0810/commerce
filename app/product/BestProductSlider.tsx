'use client';

import Slider from '@components/Slider';
import Title from '@components/Title';
import { useProductTopViewsQuery } from '@services/queries/product';
import { PATH } from '@utils/path';

import * as css from './product.css';

const BestProductSlider = () => {
  const { data: bestProducts } = useProductTopViewsQuery();

  const itemsPerPage = 4;

  const groupedProducts = bestProducts
    ? Array.from(
        { length: Math.ceil(bestProducts.length / itemsPerPage) },
        (_, index) =>
          bestProducts.slice(index * itemsPerPage, (index + 1) * itemsPerPage),
      )
    : [];

  return (
    <div className={css.bestProductWrapper}>
      <Title size="medium">BEST TOP 10</Title>
      <Slider type="carousel" height="30vw" hideDot>
        <Slider.List>
          {groupedProducts.map((group, groupIndex) => (
            <Slider.Item
              key={groupIndex}
              className={css.bestProductItemWrapper}
            >
              {group.map(({ _id, images }) => (
                <Slider.ClickableImage
                  key={_id}
                  src={
                    images?.[0]?.secureUrl ??
                    'https://placehold.co/200x300/png?text=X'
                  }
                  redirectTo={PATH.PRODUCT.DETAIL(_id)}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                  className={css.bestProductItem}
                />
              ))}
            </Slider.Item>
          ))}
        </Slider.List>
      </Slider>
    </div>
  );
};

export default BestProductSlider;

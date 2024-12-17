import Slider from '@components/Slider';
import Title from '@components/Title';
import { PATH } from '@utils/path';

import * as css from './home.css';

import type { ProductVO } from '@api/product/types/vo';

type ProductSliderPropsType = {
  products: Array<ProductVO>;
  title: string;
  subTitle?: string;
};
const ITEMS_PER_PAGE = 4;

const ProductSlider = ({
  products,
  title,
  subTitle,
}: ProductSliderPropsType) => {
  const groupedProducts = products.reduce<ProductVO[][]>(
    (acc, product, index) => {
      if (index % ITEMS_PER_PAGE === 0) acc.push([]);
      acc[acc.length - 1].push(product);

      return acc;
    },
    [],
  );

  return (
    <div className={css.sliderWrapper}>
      <Title size="large" align="center">
        {title}
        {subTitle && <span className={css.subTitle}>{subTitle}</span>}
      </Title>

      <Slider type="carousel" height="30vw" hideDot>
        <Slider.List>
          {groupedProducts.map((group, groupIndex) => (
            <Slider.Item key={groupIndex} className={css.sliderItemWrapper}>
              {group.map(({ _id, images }) => (
                <Slider.ClickableImage
                  key={_id}
                  src={
                    images?.[0]?.secureUrl ??
                    'https://placehold.co/200x300/png?text=X'
                  }
                  redirectTo={PATH.PRODUCT.DETAIL(_id)}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                  className={css.sliderItem}
                />
              ))}
            </Slider.Item>
          ))}
        </Slider.List>
      </Slider>
    </div>
  );
};

export default ProductSlider;

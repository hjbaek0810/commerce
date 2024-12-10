import type { PropsWithChildren } from 'react';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

import { formatNumber } from '@utils/formatter/number';
import { calculateSaleRate } from '@utils/math/rate';
import { PATH } from '@utils/path';

import * as css from './productGrid.css';

type ProductCardPropsType = {
  productId: string;
  categoryParam: string | null;
  subCategoryParam: string | null;
};

type ProductPricePropsType = {
  price: number;
  salePrice: number | null;
};

type ProductImagePropsType = {
  src?: string;
  alt: string;
  className?: string;
};

const ProductCardGroup = ({ children }: PropsWithChildren) => (
  <div className={css.productWrapper}>{children}</div>
);

const ProductImage = ({
  src,
  alt,
  className,
  children,
}: PropsWithChildren<ProductImagePropsType>) => (
  <figure className={css.productImageWrapper}>
    <Image
      src={src ?? 'https://placehold.co/200x300/png?text=X'}
      alt={alt}
      fill
      priority
      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
      className={clsx(css.productImage, className)}
    />
    {children}
  </figure>
);

const ProductTitle = ({ children }: PropsWithChildren) => (
  <p className={css.productName}>{children}</p>
);

const ProductPrice = ({ price, salePrice }: ProductPricePropsType) => (
  <div className={css.productPriceWrapper}>
    <span className={css.price({ hasDiscount: !!salePrice })}>
      {formatNumber(price)}
    </span>
    {!!salePrice && (
      <>
        <span className={css.saleRate}>
          {calculateSaleRate(price, salePrice)}
        </span>
        <span className={css.price({ hasDiscount: false })}>
          {formatNumber(salePrice)}
        </span>
      </>
    )}
  </div>
);

const ProductCardItem = ({
  productId,
  categoryParam,
  subCategoryParam,
  children,
}: PropsWithChildren<ProductCardPropsType>) => {
  const productDetailQuery = {
    ...(categoryParam && { category: categoryParam }),
    ...(subCategoryParam && { subCategory: subCategoryParam }),
  };

  return (
    <Link
      className={css.productItem}
      href={{
        pathname: PATH.PRODUCT.DETAIL(productId),
        query: productDetailQuery,
      }}
    >
      {children}
    </Link>
  );
};

const ProductCard = Object.assign(
  {},
  {
    Group: ProductCardGroup,
    Image: ProductImage,
    Title: ProductTitle,
    Price: ProductPrice,
    Item: ProductCardItem,
  },
);

export default ProductCard;

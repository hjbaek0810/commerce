import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

import { ColorPalettes } from '@styles/palette';
import { tokens } from '@styles/token.css';

export const productWrapper = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: tokens.spacing['spacing-008'],
});

export const productItem = style({
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.spacing['spacing-004'],
  justifyContent: 'center',
  height: '30vw',
});

export const productImageWrapper = style({
  position: 'relative',
  width: '100%',
  height: '100%',
});

export const productName = style({
  color: ColorPalettes.Grey['10'],
  fontSize: tokens.fontSize['font-size-016'],
  fontWeight: 700,
});

export const productPriceWrapper = style({
  display: 'flex',
  fontSize: tokens.fontSize['font-size-012'],
  gap: tokens.spacing['spacing-004'],
  fontWeight: 700,
});

export const price = recipe({
  variants: {
    hasDiscount: {
      true: {
        color: ColorPalettes.Grey['20'],
        textDecoration: 'line-through',
      },
      false: {
        color: ColorPalettes.Grey['00'],
        fontWeight: 800,
      },
    },
  },
});

export const saleRate = style({
  color: ColorPalettes.Red['20'],
});

export const notFoundProduct = style({
  textAlign: 'center',
  color: ColorPalettes.Grey['50'],
  fontSize: tokens.fontSize['font-size-018'],
});

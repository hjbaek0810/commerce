import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

import { ColorPalettes } from '@styles/palette';
import { sprinkles } from '@styles/sprinkles.css';
import { tokens } from '@styles/token.css';

export const infoWrapper = style({
  display: 'flex',
  gap: tokens.spacing['spacing-012'],
});

export const imageWrapper = style({
  position: 'relative',
  width: '50%',
  height: '40vw',
});

export const infoText = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: tokens.spacing['spacing-016'],
  width: '50%',
});

export const productName = style({
  color: ColorPalettes.Grey['00'],
  fontSize: tokens.fontSize['font-size-018'],
  fontWeight: 500,
});

export const productPriceWrapper = style({
  display: 'flex',
  fontSize: tokens.fontSize['font-size-016'],
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

export const productDesc = style({
  color: ColorPalettes.Grey['30'],
  fontSize: tokens.fontSize['font-size-014'],
  lineHeight: 1.4,
});

export const bestBadge = style([
  sprinkles({
    display: 'inline-block',
    paddingX: 'spacing-004',
    paddingY: 'spacing-002',
    fontSize: 'font-size-014',
    fontWeight: 'bold',
    marginLeft: 'spacing-008',
  }),
  {
    color: 'white',
    lineHeight: 1.4,
    backgroundColor: '#75b3e9',
    borderRadius: '0.4rem',
  },
]);

export const buttonWrapper = style({
  display: 'flex',
  gap: tokens.spacing['spacing-004'],
  width: '100%',
  marginTop: 'auto',
});

export const cartIcon = style({
  fontSize: tokens.sizing['sizing-024'],
  color: '#999999',
});

export const likeIcon = style({
  fontSize: tokens.sizing['sizing-024'],
  color: '#ff7878',
});

export const quantityWrapper = style({
  display: 'flex',
  width: '100%',
  height: tokens.sizing['sizing-032'],
  border: `1px solid ${ColorPalettes.Grey['60']}`,
});

export const quantityButton = style({
  width: tokens.sizing['sizing-048'],
  backgroundColor: 'white',
  borderRight: `1px solid ${ColorPalettes.Grey['60']}`,
  ':last-child': {
    borderRight: 0,
  },
  ':hover': {
    backgroundColor: ColorPalettes.Grey['90'],
  },
  ':active': {
    backgroundColor: ColorPalettes.Grey['80'],
  },
  ':disabled': {
    pointerEvents: 'none',
    opacity: 0.4,
  },
});

export const quantityIcon = style({
  color: ColorPalettes.Grey['20'],
  fontSize: tokens.fontSize['font-size-012'],
});

export const quantity = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  color: ColorPalettes.Grey['10'],
  fontSize: tokens.fontSize['font-size-014'],
  fontWeight: 600,
  backgroundColor: 'white',
  borderRight: `1px solid ${ColorPalettes.Grey['60']}`,
});

export const remainingQuantity = style({
  marginTop: tokens.spacing['spacing-002'],
  display: 'inline-block',
  color: '#FCA429',
  fontSize: tokens.fontSize['font-size-012'],
});

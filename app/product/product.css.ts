import { style } from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';

import { ColorPalettes } from '@styles/palette';
import { tokens } from '@styles/token.css';

export const notFoundProduct = style({
  textAlign: 'center',
  color: ColorPalettes.Grey['50'],
  fontSize: tokens.fontSize['font-size-018'],
});

// best product slider
export const bestProductWrapper = style({
  paddingBottom: tokens.spacing['spacing-080'],
  marginBottom: tokens.spacing['spacing-040'],
  borderBottom: '3px solid #d9d4cd',
});

export const bestProductItemWrapper = style({
  display: 'flex',
  gap: tokens.spacing['spacing-008'],
});

export const bestProductItem = style({
  width: `${calc.subtract(calc.divide('100%', 4), '0.6rem')} !important`,
});

// search
export const searchForm = style({
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.spacing['spacing-012'],
  width: '100%',
  marginBottom: tokens.spacing['spacing-080'],
});

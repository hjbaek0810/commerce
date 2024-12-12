import { style } from '@vanilla-extract/css';

import { ColorPalettes } from '@styles/palette';
import { tokens } from '@styles/token.css';

export const orderWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.spacing['spacing-056'],
});

export const orderProductWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.spacing['spacing-008'],
});

export const orderInfoWrapper = style({
  display: 'flex',
  gap: tokens.spacing['spacing-008'],
  justifyContent: 'space-between',
});

export const orderItemWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.spacing['spacing-048'],
  paddingBottom: tokens.spacing['spacing-056'],
  borderBottom: `2px solid ${ColorPalettes.Grey['80']}`,

  ':last-child': {
    paddingBottom: 0,
    borderBottom: 0,
  },
});

export const imageWrapper = style({
  position: 'relative',
  height: '15vw',
});

export const totalPrice = style({
  display: 'block',
  fontWeight: '800',
  fontSize: tokens.fontSize['font-size-016'],
  textAlign: 'end',
});

export const addressWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.spacing['spacing-004'],
});

export const paymentTypeWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.spacing['spacing-004'],
});

export const emptyOrderListWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
});

export const emptyOrderList = style({
  width: '50%',
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.spacing['spacing-024'],
  textAlign: 'center',
});

export const emptyCartIcon = style({
  fontSize: tokens.sizing['sizing-128'],
  color: ColorPalettes.Grey['80'],
});

export const emptyText = style({
  fontSize: tokens.fontSize['font-size-016'],
  color: ColorPalettes.Grey['50'],
});

export const userButtonWrapper = style({
  display: 'flex',
  justifyContent: 'center',
});

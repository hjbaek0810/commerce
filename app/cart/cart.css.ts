import { style } from '@vanilla-extract/css';

import { ColorPalettes } from '@styles/palette';
import { tokens } from '@styles/token.css';

export const cartGrid = style({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  gap: tokens.spacing['spacing-012'],
});

export const imageWrapper = style({
  position: 'relative',
  height: '15vw',
});

export const deleteButtonWrapper = style({
  display: 'flex',
  justifyContent: 'flex-end',
});

export const buyButtonWrapper = style({
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: 'auto',
});

export const emptyCartListWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
});

export const emptyCartList = style({
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

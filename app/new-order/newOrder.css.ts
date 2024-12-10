import { style } from '@vanilla-extract/css';

import { tokens } from '@styles/token.css';

export const orderWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.spacing['spacing-024'],
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

export const orderButtonWrapper = style({
  display: 'flex',
  justifyContent: 'flex-end',
});

export const addressWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.spacing['spacing-004'],
});

export const postCodeWrapper = style({
  display: 'flex',
  gap: tokens.spacing['spacing-004'],
});

export const paymentTypeRadioWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.spacing['spacing-008'],
});

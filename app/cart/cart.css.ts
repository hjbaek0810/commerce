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
  width: '15vw',
  height: '15vw',
});

export const deleteButtonWrapper = style({
  display: 'flex',
  justifyContent: 'end',
});

export const buyButtonWrapper = style({
  display: 'flex',
  justifyContent: 'end',
  marginTop: 'auto',
});

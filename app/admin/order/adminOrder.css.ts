import { style } from '@vanilla-extract/css';

import { tokens } from '@styles/token.css';

export const orderWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.spacing['spacing-024'],
});

export const filterWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.spacing['spacing-024'],
  alignItems: 'center',
});

export const tableWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.spacing['spacing-012'],
  alignItems: 'flex-end',
});

export const sortWrapper = style({
  width: '50%',
  alignSelf: 'flex-end',
});

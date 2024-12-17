import { style } from '@vanilla-extract/css';

import { tokens } from '@styles/token.css';

export const signUpFormWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.spacing['spacing-048'],
  alignItems: 'center',
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

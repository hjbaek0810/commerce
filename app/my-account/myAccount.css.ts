import { style } from '@vanilla-extract/css';

import { tokens } from '@styles/token.css';

export const accountFormWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.spacing['spacing-012'],
  alignItems: 'flex-end',
});

export const passwordWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.spacing['spacing-004'],
  alignItems: 'flex-start',
});

export const buttonWrapper = style({
  display: 'flex',
  gap: tokens.spacing['spacing-004'],
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

import { style } from '@vanilla-extract/css';

import { tokens } from '@styles/token.css';

export const signInWrapper = style({
  width: '50%',
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.spacing['spacing-040'],
  justifyContent: 'center',
  alignItems: 'center',
  margin: '0 auto',
  height: '100%',
});

export const signInForm = style({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.spacing['spacing-016'],
});

export const createAccountLink = style({
  color: '#1C78C7',
  fontSize: tokens.fontSize['font-size-014'],
  fontWeight: 600,
  textAlign: 'end',
});

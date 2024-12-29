import { style } from '@vanilla-extract/css';

import { sprinkles } from '@styles/sprinkles.css';
import { tokens } from '@styles/token.css';

export const dashboardWrapper = sprinkles({
  display: 'flex',
  flexDirection: 'column',
  gap: 'spacing-040',
});

export const searchDateWrapper = sprinkles({
  display: 'flex',
  flexDirection: 'column',
  gap: 'spacing-008',
});

export const dateInputWrapper = sprinkles({
  display: 'flex',
  alignItems: 'center',
});

export const searchForm = style({
  width: '35%',
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.spacing['spacing-008'],
  marginLeft: 'auto',
});

export const totalAmountBox = style({
  width: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#3892ed',
  color: 'white',
  fontSize: tokens.fontSize['font-size-020'],
  borderRadius: '0.4rem',
});

export const totalUserText = style({
  padding: tokens.spacing['spacing-012'],
  marginLeft: 'auto',
  width: 'fit-content',
  color: 'white',
  fontSize: tokens.fontSize['font-size-016'],
  fontWeight: 600,
  backgroundColor: '#85a1b7',
  borderRadius: '0.4rem',
});

import { style } from '@vanilla-extract/css';

import { tokens } from '@styles/token.css';

export const saleWrapper = style({
  display: 'flex',
  gap: tokens.spacing['spacing-012'],
});

export const calculatedSale = style({
  display: 'flex',
  alignItems: 'center',
  minWidth: '40%',
  color: '#DF564F',
  fontSize: tokens.fontSize['font-size-014'],
  fontWeight: 700,
});

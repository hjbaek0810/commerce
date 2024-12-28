import { style } from '@vanilla-extract/css';

import { sprinkles } from '@styles/sprinkles.css';
import { tokens } from '@styles/token.css';

export const dashboardWrapper = sprinkles({
  display: 'flex',
  justifyContent: 'space-between',
  height: 'sizing-560',
});

export const userSearchFormWrapper = sprinkles({
  display: 'flex',
  flexDirection: 'column',
  gap: 'spacing-008',
  paddingY: 'spacing-024',
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

export const userSearchDateButtonWrapper = sprinkles({
  display: 'flex',
  gap: 'spacing-004',
  justifyContent: 'flex-end',
});

export const dashboardContainer = style({
  width: '70%',
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

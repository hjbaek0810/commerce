import { style } from '@vanilla-extract/css';

import { ColorPalettes } from '@styles/palette';
import { tokens } from '@styles/token.css';

export const errorContainer = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: tokens.spacing['spacing-024'],
  width: '100%',
  height: '100%',
});

export const errorIcon = style({
  color: ColorPalettes.Grey['60'],
  fontSize: tokens.sizing['sizing-096'],
});

export const errorText = style({
  color: ColorPalettes.Grey['30'],
  fontSize: tokens.fontSize['font-size-018'],
  textAlign: 'center',
  lineHeight: 1.6,
});

export const buttonWrapper = style({
  display: 'flex',
  gap: tokens.spacing['spacing-008'],
  justifyContent: 'space-between',
  width: 'fit-content',
});

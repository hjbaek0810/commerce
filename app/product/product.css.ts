import { style } from '@vanilla-extract/css';

import { ColorPalettes } from '@styles/palette';
import { tokens } from '@styles/token.css';

export const notFoundProduct = style({
  textAlign: 'center',
  color: ColorPalettes.Grey['50'],
  fontSize: tokens.fontSize['font-size-018'],
});

// search
export const searchForm = style({
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.spacing['spacing-012'],
  width: '100%',
  marginBottom: tokens.spacing['spacing-080'],
});

export const soldOutImage = style({ opacity: 0.4 });

export const soldOutImageText = style({
  position: 'absolute',
  right: '1rem',
  top: '1rem',
  fontSize: tokens.fontSize['font-size-012'],
  fontWeight: 700,
  color: ColorPalettes.Red['20'],
});

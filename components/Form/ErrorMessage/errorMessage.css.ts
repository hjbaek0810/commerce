import { style } from '@vanilla-extract/css';

import { ColorPalettes } from '@styles/palette';
import { tokens } from '@styles/token.css';

export const message = style({
  marginLeft: tokens.spacing['spacing-002'],
  marginTop: tokens.spacing['spacing-004'],
  color: ColorPalettes.Red['20'],
  fontSize: tokens.fontSize['font-size-012'],
});

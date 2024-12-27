import { style } from '@vanilla-extract/css';

import { ColorPalettes } from '@styles/palette';
import { tokens } from '@styles/token.css';

export const calendarIcon = style({
  position: 'absolute',
  top: '50%',
  right: '0.8rem',
  transform: 'translateY(-50%)',
  color: ColorPalettes.Grey['30'],
  fontSize: tokens.fontSize['font-size-012'],
});

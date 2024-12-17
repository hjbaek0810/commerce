import { style } from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';

import { ColorPalettes } from '@styles/palette';
import { sprinkles } from '@styles/sprinkles.css';
import { tokens } from '@styles/token.css';

export const subTitle = style({
  display: 'block',
  marginBottom: tokens.spacing['spacing-008'],
  color: ColorPalettes.Grey['40'],
  fontSize: tokens.fontSize['font-size-014'],
  textAlign: 'center',
  fontWeight: 400,
});

export const sliderWrapper = sprinkles({
  paddingY: 'spacing-056',
});

export const sliderItemWrapper = style({
  display: 'flex',
  gap: tokens.spacing['spacing-008'],
});

export const sliderItem = style({
  width: `${calc.subtract(calc.divide('100%', 4), '0.6rem')} !important`,
});

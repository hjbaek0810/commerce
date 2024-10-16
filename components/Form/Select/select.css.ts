import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

import { ColorPalettes } from '@styles/palette';
import { tokens } from '@styles/token.css';

import type { InputVariants } from '@components/Form/Input/input.css';

export const selectWrapper = style({
  position: 'relative',
});

export const selectArrowIcon = recipe({
  base: {
    position: 'absolute',
    fontSize: tokens.fontSize['font-size-014'],
    color: ColorPalettes.Grey['50'],
    pointerEvents: 'none',
  },
  variants: {
    error: {
      true: {
        right: tokens.spacing['spacing-024'],
      },
      false: {
        right: tokens.spacing['spacing-008'],
      },
    },
  },
});

export type SelectVariants = InputVariants;

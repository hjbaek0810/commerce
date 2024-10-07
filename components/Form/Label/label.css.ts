import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

import { ColorPalettes } from '@styles/palette';
import { tokens } from '@styles/token.css';

import type { RecipeVariants } from '@vanilla-extract/recipes';

export const label = recipe({
  base: {
    fontWeight: 600,
    fontSize: tokens.fontSize['font-size-012'],
  },
  variants: {
    error: {
      true: {
        color: ColorPalettes.Red['20'],
      },
      false: {
        color: ColorPalettes.Grey['10'],
      },
    },
  },
  defaultVariants: {
    error: false,
  },
});

export const star = style({
  marginLeft: tokens.spacing['spacing-004'],
  color: ColorPalettes.Red['20'],
});

export type LabelVariants = NonNullable<RecipeVariants<typeof label>>;

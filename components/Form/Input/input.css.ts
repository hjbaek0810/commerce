import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

import { ColorPalettes } from '@styles/palette';
import { sprinkles } from '@styles/sprinkles.css';
import { tokens } from '@styles/token.css';

import type { RecipeVariants } from '@vanilla-extract/recipes';

export const inputWrapper = style({
  width: '100%',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: tokens.spacing['spacing-004'],
  border: '1px solid #d9d4cd',
  transition: 'all 100ms cubic-bezier(0.4, 0, 0.2, 1)',
});

export const input = recipe({
  base: [
    sprinkles({
      width: 'sizing-fill',
      height: 'sizing-032',
      paddingY: 'spacing-008',
      paddingLeft: 'spacing-008',
    }),
    {
      backgroundColor: 'white',

      selectors: {
        '&[readonly]': {
          pointerEvents: 'none',
          backgroundColor: 'transparent',
        },
      },
    },
  ],
  variants: {
    error: {
      true: {
        paddingRight: tokens.spacing['spacing-024'],
      },
      false: {
        paddingRight: tokens.spacing['spacing-004'],
      },
    },
  },
  defaultVariants: {
    error: false,
  },
});

export const errorIcon = style({
  position: 'absolute',
  top: '50%',
  right: '0.4rem',
  transform: 'translateY(-50%)',
  color: ColorPalettes.Red['20'],
  fontSize: tokens.fontSize['font-size-016'],
});

export type InputVariants = NonNullable<RecipeVariants<typeof input>>;

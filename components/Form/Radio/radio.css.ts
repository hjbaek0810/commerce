import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

import { ColorPalettes } from '@styles/palette';
import { sprinkles } from '@styles/sprinkles.css';
import { tokens } from '@styles/token.css';

import type { RecipeVariants} from '@vanilla-extract/recipes';

export const radioWrapper = recipe({
  variants: {
    disabled: {
      true: {
        opacity: '0.4',
        cursor: 'default',
        pointerEvents: 'none',
      },
      false: {
        cursor: 'pointer',
      },
    },
  },
  base: {
    display: 'flex',
    alignItems: 'center',
    width: 'fit-content',
    color: ColorPalettes.Grey['00'],
    gap: tokens.spacing['spacing-008'],

    ':focus': { outline: 'none' },
  },
});

export const radio = recipe({
  base: [
    sprinkles({
      paddingY: 'spacing-002',
    }),
    {
      width: '16px',
      height: '16px',
      cursor: 'pointer',
      borderStyle: 'solid',
      borderRadius: '100%',
      backgroundColor: 'white',
      appearance: 'none',
      transition: 'all 100ms cubic-bezier(0.4, 0, 0.2, 1)',
      ':checked': {
        borderWidth: '0.4rem',
      },
    },
  ],
  variants: {
    error: {
      true: {
        borderWidth: '0.2rem',
        borderColor: ColorPalettes.Red['50'],

        selectors: {
          [`${radioWrapper({})}:hover &:not(:checked), &:not(:checked):hover`]:
            {
              backgroundColor: ColorPalettes.Red['90'],
            },
          [`${radioWrapper({})}:focus &:not(:checked), &:not(:checked):focus`]:
            {
              backgroundColor: ColorPalettes.Red['80'],
            },
        },
      },
      false: {
        borderWidth: '0.1rem',

        selectors: {
          '&:not(:checked)': {
            borderColor: ColorPalettes.Grey['20'],
          },
          '&:checked': {
            borderColor: '#bfbab3',
          },
          [`${radioWrapper({})}:hover &:not(:checked), &:not(:checked):hover`]:
            {
              backgroundColor: ColorPalettes.Grey['95'],
              borderColor: ColorPalettes.Grey['40'],
            },
          [`${radioWrapper({})}:focus &:not(:checked), &:not(:checked):focus`]:
            {
              backgroundColor: ColorPalettes.Grey['90'],
              borderColor: ColorPalettes.Grey['20'],
            },
        },
      },
    },
  },
});

export const label = style({
  color: ColorPalettes.Grey['10'],
  fontSize: tokens.fontSize['font-size-014'],
  lineHeight: '1.4',
});

export type RadioVariants = NonNullable<RecipeVariants<typeof radio>>;

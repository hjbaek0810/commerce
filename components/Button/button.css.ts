import { recipe } from '@vanilla-extract/recipes';

import { ColorPalettes } from '@styles/palette';
import { sprinkles } from '@styles/sprinkles.css';

import type { RecipeVariants } from '@vanilla-extract/recipes';

export const button = recipe({
  base: [
    {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      // height: 'fit-content',
      fontWeight: '700',
      whiteSpace: 'nowrap',
      border: '0.1rem solid',
      borderRadius: '0.4rem',
      outline: '0 solid white',
      transition: 'all 100ms cubic-bezier(0.4, 0, 0.2, 1)',
      lineHeight: '1.4',

      ':disabled': {
        opacity: '0.4',
        cursor: 'default',
      },
    },
  ],
  variants: {
    size: {
      small: sprinkles({
        gap: 'spacing-004',
        paddingX: 'spacing-008',
        paddingY: 'spacing-004',
        fontSize: 'font-size-012',
      }),
      medium: sprinkles({
        gap: 'spacing-008',
        paddingX: 'spacing-016',
        paddingY: 'spacing-008',
        fontSize: 'font-size-014',
      }),
      large: sprinkles({
        gap: 'spacing-008',
        paddingX: 'spacing-032',
        paddingY: 'spacing-016',
        fontSize: 'font-size-016',
      }),
    },
    color: {
      theme: {
        color: ColorPalettes.Grey['00'],
        borderColor: '#d9d4cd',

        selectors: {
          '&:hover:not(:disabled)': {
            backgroundColor: '#eeecea',
          },
          '&:active:not(:disabled)': {
            backgroundColor: '#e5e0dc',
          },
          '&:focus:not(:disabled)': {
            outlineWidth: '0.1rem',
            boxShadow: `0 0 0 4px #f2ede5d1`,
          },
        },
      },
      secondary: {
        color: ColorPalettes.Grey['10'],
        borderColor: ColorPalettes.Grey['60'],

        selectors: {
          '&:hover:not(:disabled)': {
            backgroundColor: ColorPalettes.Grey['90'],
          },
          '&:active:not(:disabled)': {
            backgroundColor: ColorPalettes.Grey['80'],
          },
          '&:focus:not(:disabled)': {
            outlineWidth: '0.1rem',
            boxShadow: `0 0 0 4px ${ColorPalettes.Grey['90']}`,
          },
        },
      },
    },
    fill: {
      true: {},
      false: {
        backgroundColor: 'white',
      },
    },
    fullWidth: {
      true: {
        width: '100%',
      },
      false: {},
    },
  },

  compoundVariants: [
    {
      variants: {
        color: 'theme',
        fill: true,
      },
      style: [
        {
          backgroundColor: '#eae5dd',
        },
      ],
    },
    {
      variants: {
        color: 'secondary',
        fill: true,
      },
      style: [
        {
          backgroundColor: ColorPalettes.Grey['80'],
        },
      ],
    },
  ],
});

export type ButtonVariants = NonNullable<RecipeVariants<typeof button>>;

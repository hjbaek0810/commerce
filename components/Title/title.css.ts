import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

import { ColorPalettes } from '@styles/palette';
import { sprinkles } from '@styles/sprinkles.css';
import { tokens } from '@styles/token.css';

import type { RecipeVariants } from '@vanilla-extract/recipes';

export const titleWrapper = style({
  display: 'flex',
  gap: tokens.spacing['spacing-008'],
  alignItems: 'center',
});

export const title = recipe({
  base: [
    sprinkles({
      paddingY: 'spacing-012',
    }),
    {
      color: ColorPalettes.Grey['10'],
      lineHeight: '1.4',
      fontWeight: '700',
    },
  ],
  variants: {
    size: {
      small: sprinkles({
        fontSize: 'font-size-014',
      }),
      medium: sprinkles({
        fontSize: 'font-size-016',
      }),
      large: sprinkles({
        fontSize: 'font-size-020',
      }),
    },
    align: {
      start: { textAlign: 'start' },
      center: { textAlign: 'center' },
      end: { textAlign: 'end' },
    },
  },
});

export const backButton = style({
  width: tokens.sizing['sizing-028'],
  height: tokens.sizing['sizing-028'],
});

export const backButtonIcon = style({
  color: ColorPalettes.Grey['40'],
  fontSize: tokens.sizing['sizing-016'],
});

export type TitleVariants = NonNullable<RecipeVariants<typeof title>>;

import { recipe } from '@vanilla-extract/recipes';

import { ColorPalettes } from '@styles/palette';
import { sprinkles } from '@styles/sprinkles.css';

import type { RecipeVariants } from '@vanilla-extract/recipes';


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
  },
});

export type TitleVariants = NonNullable<RecipeVariants<typeof title>>;

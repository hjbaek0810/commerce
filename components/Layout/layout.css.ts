import { style } from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';
import { recipe } from '@vanilla-extract/recipes';

import { HEADER_BAR_HEIGHT } from '@components/Header/header.css';
import { SIDE_MENU_WIDTH } from '@components/SideMenu/sideMenu.css';
import { sprinkles } from '@styles/sprinkles.css';
import { tokens } from '@styles/token.css';

import type { RecipeVariants } from '@vanilla-extract/recipes';

export const layout = style({
  marginTop: HEADER_BAR_HEIGHT,
  height: calc.subtract('100%', HEADER_BAR_HEIGHT),
});

export const outlet = recipe({
  base: [
    sprinkles({
      width: 'sizing-fill',
    }),
    {
      overflow: 'auto',
    },
  ],
  variants: {
    isPadded: {
      false: {
        padding: 0,
      },
      true: [
        sprinkles({
          paddingX: 'spacing-024',
          paddingY: 'spacing-032',
        }),
        {
          selectors: {
            'aside[data-hide="false"]+&': {
              paddingLeft: calc.add(
                SIDE_MENU_WIDTH,
                tokens.spacing['spacing-024'],
              ),
            },
          },
        },
      ],
    },
    fullHeight: {
      false: sprinkles({
        height: 'sizing-auto',
      }),
      true: sprinkles({
        height: 'sizing-fill',
      }),
    },
  },
  defaultVariants: {
    isPadded: true,
  },
});

export type OutletVariants = NonNullable<RecipeVariants<typeof outlet>>;

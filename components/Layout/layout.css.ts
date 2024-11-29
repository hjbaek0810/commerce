import { style } from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';
import { recipe } from '@vanilla-extract/recipes';

import { HEADER_BAR_HEIGHT } from '@components/Header/header.css';
import { SIDE_MENU_WIDTH } from '@components/SideMenu/sideMenu.css';
import { sprinkles } from '@styles/sprinkles.css';
import { tokens } from '@styles/token.css';

export const layout = style({
  marginTop: HEADER_BAR_HEIGHT,
  height: calc.subtract('100%', HEADER_BAR_HEIGHT),
});

export const outlet = style([
  sprinkles({
    width: 'sizing-fill',
    minHeight: 'sizing-fill',
    paddingRight: 'spacing-024',
    paddingY: 'spacing-032',
  }),
  { paddingLeft: calc.add(SIDE_MENU_WIDTH, tokens.spacing['spacing-024']) },
  {
    selectors: {
      'aside[data-hide="true"]+&': {
        padding: 0,
      },
    },
  },
]);

import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

import { ColorPalettes } from '@styles/palette';
import { tokens } from '@styles/token.css';

export const SIDE_MENU_WIDTH = tokens.sizing['sizing-160'];

export const sideMenu = style({
  position: 'fixed',
  width: SIDE_MENU_WIDTH,
  minWidth: SIDE_MENU_WIDTH,
  height: '100%',
  zIndex: tokens.zIndex['z-index-sticky'],
  backgroundColor: ColorPalettes.Grey['95'],

  selectors: {
    '&[data-hide="true"]': {
      display: 'none',
    },
  },
});

export const sideMenuItem = style({
  display: 'block',
  padding: tokens.spacing['spacing-016'],
  fontSize: tokens.fontSize['font-size-014'],
  fontWeight: 600,
});

export const sideMenuItemBg = recipe({
  variants: {
    selected: {
      true: {
        backgroundColor: 'white',
      },
      false: {},
    },
  },
  defaultVariants: {
    selected: false,
  },
});

export const logoutButton = style({
  position: 'absolute',
  width: 'fit-content',
  fontSize: tokens.sizing['sizing-032'],
  color: ColorPalettes.Grey['20'],
  right: '2rem',
  bottom: '3rem',
});

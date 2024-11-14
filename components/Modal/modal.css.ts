import { style } from '@vanilla-extract/css';

import { ColorPalettes } from '@styles/palette';
import { sprinkles } from '@styles/sprinkles.css';
import { tokens } from '@styles/token.css';

export const header = style([
  sprinkles({
    paddingX: 'spacing-016',
    paddingY: 'spacing-012',
    fontWeight: 'bold',
  }),
  {
    backgroundColor: '#eae5dd',
    borderBottom: '1px solid #d9d4cd',
  },
]);

export const headerTitle = style({
  color: ColorPalettes.Grey['10'],
  fontSize: tokens.fontSize['font-size-018'],
});

export const body = style([
  sprinkles({
    padding: 'spacing-016',
    fontSize: 'font-size-014',
    minHeight: 'sizing-096',
  }),
  { color: ColorPalettes.Grey['00'] },
]);

export const footer = style([
  sprinkles({
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 'spacing-004',
    paddingX: 'spacing-016',
    paddingY: 'spacing-012',
  }),
  {
    borderTop: '1px solid #d9d4cd',
  },
]);

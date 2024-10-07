import { style } from '@vanilla-extract/css';

import { sprinkles } from '@styles/sprinkles.css';

export const root = style({
  width: '100%',
  border: '2px solid #d9d4cd',
});

export const table = style({
  width: '100%',
  tableLayout: 'fixed',
});

export const header = style({});

export const th = style([
  sprinkles({
    paddingX: 'spacing-012',
    paddingY: 'spacing-016',
  }),
  {
    width: '20%',
    textAlign: 'left',
    backgroundColor: '#eae5dd',
  },
]);

export const body = style({});

export const td = style([
  sprinkles({
    paddingX: 'spacing-012',
    paddingY: 'spacing-016',
  }),
]);

export const tr = style({
  borderBottom: '1px solid #d9d4cd',

  ':last-child': {
    borderBottom: 0,
  },
});

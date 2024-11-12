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
    fontSize: 'font-size-012',
  }),
  {
    width: '20%',
    textAlign: 'left',
    backgroundColor: '#eae5dd',
    verticalAlign: 'top',
  },
]);

export const body = style({});

export const td = style([
  {
    verticalAlign: 'top',
  },
  sprinkles({
    paddingX: 'spacing-012',
    paddingY: 'spacing-016',
    fontSize: 'font-size-012',
  }),
]);

export const tr = style({
  borderBottom: '1px solid #d9d4cd',

  ':last-child': {
    borderBottom: 0,
  },
});

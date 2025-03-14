import { createSprinkles, defineProperties } from '@vanilla-extract/sprinkles';

import { tokens } from './token.css';

const displayProperties = defineProperties({
  properties: {
    display: ['flex', 'block', 'inline', 'inline-block', 'none'],
    flexDirection: ['row', 'column'],
    flexWrap: ['nowrap', 'wrap'],
    justifyContent: [
      'flex-start',
      'flex-end',
      'center',
      'space-between',
      'space-around',
      'space-evenly',
    ],
    alignItems: ['flex-start', 'center', 'flex-end'],
    alignSelf: ['flex-start', 'center', 'flex-end'],
  },
});

const overflowProperties = defineProperties({
  properties: {
    overflow: ['auto', 'hidden', 'scroll'],
  },
});

const spacingProperties = defineProperties({
  properties: {
    padding: tokens.spacing,
    paddingTop: tokens.spacing,
    paddingBottom: tokens.spacing,
    paddingLeft: tokens.spacing,
    paddingRight: tokens.spacing,
    margin: { ...tokens.spacing, horizontalCenter: '0 auto' },
    marginTop: tokens.spacing,
    marginBottom: tokens.spacing,
    marginLeft: tokens.spacing,
    marginRight: tokens.spacing,
    gap: tokens.spacing,
  },
  shorthands: {
    paddingX: ['paddingRight', 'paddingLeft'],
    paddingY: ['paddingTop', 'paddingBottom'],
    marginX: ['marginRight', 'marginLeft'],
    marginY: ['marginTop', 'marginBottom'],
  },
});

const fontProperties = defineProperties({
  properties: {
    fontSize: tokens.fontSize,
    fontWeight: ['bold', 'normal'],
    textAlign: ['start', 'center', 'end'],
  },
});

const sizingProperties = defineProperties({
  properties: {
    width: tokens.sizing,
    minWidth: tokens.sizing,
    maxWidth: tokens.sizing,
    height: tokens.sizing,
    minHeight: tokens.sizing,
    maxHeight: tokens.sizing,
  },
});

const zIndexProperties = defineProperties({
  properties: {
    zIndex: tokens.zIndex,
  },
});

export const sprinkles = createSprinkles(
  displayProperties,
  overflowProperties,
  spacingProperties,
  fontProperties,
  sizingProperties,
  zIndexProperties,
);

export type Sprinkles = Parameters<typeof sprinkles>[0];

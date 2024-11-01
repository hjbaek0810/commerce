import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

import { ColorPalettes } from '@styles/palette';
import { tokens } from '@styles/token.css';

export const fileWrapper = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing['spacing-008'],
    padding: tokens.sizing['sizing-016'],
    height: tokens.sizing['sizing-080'],
    border: '2px solid #d9d4cd',
    borderRadius: '0.4rem',
  },
  variants: {
    active: {
      true: {
        backgroundColor: '#fff7d0',
      },
      false: {},
    },
  },
});

export const fileName = recipe({
  base: {
    fontSize: tokens.fontSize['font-size-014'],
    marginRight: 'auto',
  },
  variants: {
    attached: {
      true: {
        fontWeight: 700,
        color: ColorPalettes.Grey['00'],
      },
      false: {
        color: ColorPalettes.Grey['40'],
      },
    },
  },
});

export const errorIcon = style({
  color: ColorPalettes.Red['20'],
  fontSize: tokens.fontSize['font-size-016'],
});

export const removeButton = style({
  width: tokens.sizing['sizing-024'],
  height: tokens.sizing['sizing-024'],
  backgroundColor: ColorPalettes.Grey['90'],
  border: `0.1rem solid ${ColorPalettes.Grey['60']}`,
  borderRadius: '50%',

  ':hover': {
    backgroundColor: ColorPalettes.Grey['95'],
  },
});

export const removeIcon = style({
  color: ColorPalettes.Grey['60'],
  fontSize: tokens.sizing['sizing-016'],
});

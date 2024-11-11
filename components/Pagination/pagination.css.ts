import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

import { ColorPalettes } from '@styles/palette';
import { tokens } from '@styles/token.css';

export const pagination = style({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: tokens.spacing['spacing-024'],
  justifyContent: 'space-between',
});

export const sizeSelectorWrapper = style({
  display: 'flex',
  alignItems: 'center',
});

export const sizeTitle = style({
  fontSize: tokens.fontSize['font-size-012'],
  whiteSpace: 'nowrap',
  marginRight: tokens.spacing['spacing-004'],
});

export const sizeSelector = style({
  maxWidth: tokens.sizing['sizing-056'],
});

export const range = style({
  display: 'flex',
  gap: tokens.spacing['spacing-004'],
});

export const rangeButton = recipe({
  base: {
    display: 'flex',
    justifyContent: 'center',
    width: tokens.sizing['sizing-032'],
    height: tokens.sizing['sizing-032'],
    fontSize: tokens.fontSize['font-size-014'],
    textAlign: 'center',
    color: ColorPalettes.Grey['20'],
    borderRadius: '50%',
    border: '1px solid transparent',
  },
  variants: {
    active: {
      true: {
        color: 'white',
        backgroundColor: '#d9d4cd',
        fontWeight: 700,
        borderColor: 'transparent',
      },
      false: {
        ':hover': {
          borderColor: ColorPalettes.Grey['30'],
        },
      },
    },
    disabled: {
      true: {
        pointerEvents: 'none',
        cursor: 'default',
        opacity: '0.5',
      },
      false: {
        cursor: 'pointer',
      },
    },
  },
  defaultVariants: {
    active: false,
    disabled: false,
  },
});

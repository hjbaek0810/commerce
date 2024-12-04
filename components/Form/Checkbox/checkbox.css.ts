import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

import { ColorPalettes } from '@styles/palette';
import { sprinkles } from '@styles/sprinkles.css';
import { tokens } from '@styles/token.css';

export const input = style({
  position: 'absolute',
  top: 0,
  left: 0,
  opacity: 0,
  cursor: 'pointer',
});

export const label = style({
  color: ColorPalettes.Grey['10'],
  fontSize: tokens.fontSize['font-size-014'],
  fontWeight: 600,
});

export const checkboxWrapper = style([
  sprinkles({
    gap: 'spacing-008',
  }),
  {
    display: 'flex',
    alignItems: 'center',
    width: 'fit-content',
    cursor: 'pointer',

    selectors: {
      [`&:has(${input}:disabled)`]: {
        opacity: 0.4,
        cursor: 'default',
      },
    },
  },
]);

export const checkbox = recipe({
  base: [
    {
      position: 'relative',
      width: '16px',
      height: '16px',
      minWidth: '16px',
      minHeight: '16px',
      border: `1px solid ${ColorPalettes.Grey['20']}`,
      transition: 'all 100ms cubic-bezier(0.4, 0, 0.2, 1)',
      backgroundColor: 'white',
      borderRadius: '0.2rem',
      selectors: {
        [`${checkboxWrapper}:hover &:has(${input}:not(:disabled))`]: {
          backgroundColor: ColorPalettes.Grey['95'],
          borderColor: ColorPalettes.Grey['40'],
        },
        [`${checkboxWrapper}:active &:has(${input}:not(:disabled))`]: {
          backgroundColor: ColorPalettes.Grey['90'],
        },
      },
    },
  ],

  variants: {
    checked: {
      true: {},
      false: {},
    },
    error: {
      true: {},
      false: {},
    },
  },

  compoundVariants: [
    {
      variants: {
        checked: false,
        error: false,
      },
      style: {
        border: `1px solid ${ColorPalettes.Grey['20']}`,
        selectors: {
          [`${checkboxWrapper}:hover &:has(${input}:not(:disabled))`]: {
            backgroundColor: ColorPalettes.Grey['95'],
            borderColor: ColorPalettes.Grey['40'],
          },
          [`${checkboxWrapper}:active &:has(${input}:not(:disabled))`]: {
            backgroundColor: ColorPalettes.Grey['90'],
          },
        },
      },
    },
    {
      variants: {
        checked: true,
        error: false,
      },
      style: {
        backgroundColor: '#baae9b',
        selectors: {
          [`${checkboxWrapper}:hover &:has(${input}:not(:disabled))`]: {
            backgroundColor: '#aa997b',
          },
          [`${checkboxWrapper}:active &:has(${input}:not(:disabled))`]: {
            backgroundColor: '#847b6b',
          },
        },
      },
    },
    {
      variants: {
        checked: false,
        error: true,
      },
      style: {
        borderWidth: '0.2rem',
        borderColor: ColorPalettes.Red['50'],
        selectors: {
          [`${checkboxWrapper}:hover &:has(${input}:not(:disabled))`]: {
            borderColor: ColorPalettes.Red['50'],
            backgroundColor: ColorPalettes.Red['90'],
          },
          [`${checkboxWrapper}:active &:has(${input}:not(:disabled))`]: {
            borderColor: ColorPalettes.Red['20'],
            backgroundColor: ColorPalettes.Red['80'],
          },
        },
      },
    },
    {
      variants: {
        checked: true,
        error: true,
      },
      style: {
        backgroundColor: ColorPalettes.Red['20'],
        selectors: {
          [`${checkboxWrapper}:hover &:has(${input}:not(:disabled))`]: {
            backgroundColor: ColorPalettes.Red['30'],
          },
          [`${checkboxWrapper}:active &:has(${input}:not(:disabled))`]: {
            backgroundColor: ColorPalettes.Red['40'],
          },
        },
      },
    },
  ],
});

export const checkboxIcon = style({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%,-50%)',
  color: 'white',
  fontSize: '1rem',
});

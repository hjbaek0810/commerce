import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

import { ColorPalettes } from '@styles/palette';
import { sprinkles } from '@styles/sprinkles.css';
import { tokens } from '@styles/token.css';

import type { ComplexStyleRule } from '@vanilla-extract/css';

export const saleWrapper = style({
  display: 'flex',
  gap: tokens.spacing['spacing-012'],
});

export const calculatedSale = style({
  display: 'flex',
  alignItems: 'center',
  minWidth: '40%',
  color: '#DF564F',
  fontSize: tokens.fontSize['font-size-014'],
  fontWeight: 700,
});

export const subCategoryRadioGroup = style({
  display: 'flex',
  gap: tokens.spacing['spacing-008'],
  height: tokens.sizing['sizing-032'],
});

export const imagePreviewTitle = sprinkles({
  paddingY: 'spacing-008',
  fontSize: 'font-size-016',
  fontWeight: 'bold',
});

export const imagePreviewWrapper = style({
  display: 'flex',
  gap: tokens.spacing['spacing-004'],
});

export const imagePreview = style({
  objectFit: 'contain',
  border: `2px solid ${ColorPalettes.Grey['30']}`,
});

const backdropStyle: ComplexStyleRule = {
  position: 'absolute',
  left: 0,
  top: 0,
  content: '',
  width: '100%',
  height: '100%',
  backgroundColor: '#373737',
  opacity: 0.4,
};

export const deleteImageWrapper = style({
  display: 'flex',
  gap: tokens.spacing['spacing-004'],
});

export const deleteImageButton = recipe({
  base: {
    position: 'relative',
  },
  variants: {
    active: {
      true: {
        selectors: {
          '&:not(:disabled)::after': backdropStyle,
        },
      },
      false: {
        selectors: {
          '&:not(:disabled):hover::after': backdropStyle,
        },
      },
    },
  },
  defaultVariants: {
    active: false,
  },
});

const iconStyle: ComplexStyleRule = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  zIndex: 1,
  transform: 'translate(-50%,-50%)',
  color: 'white',
};

export const trashIcon = style({
  ...iconStyle,
  display: 'none',
  fontSize: tokens.sizing['sizing-032'],

  selectors: {
    'button:hover &': {
      display: 'block',
    },
  },
});

export const minusIcon = style({
  ...iconStyle,
  fontSize: tokens.sizing['sizing-064'],
});

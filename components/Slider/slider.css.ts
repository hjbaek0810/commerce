import { createVar, style } from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';
import { recipe } from '@vanilla-extract/recipes';

import { tokens } from '@styles/token.css';

import type { RecipeVariants } from '@vanilla-extract/recipes';

export const itemIndexVar = createVar();

export const sliderRoot = style({
  position: 'relative',
  overflow: 'hidden',
});

export const sliderItem = recipe({
  base: {
    width: '100%',
    height: '100%',
  },
  variants: {
    type: {
      fade: {
        position: 'absolute',
        transition: 'opacity 0.3s ease-in-out',
      },
      carousel: {
        position: 'relative',
        flexShrink: '0',
      },
    },
    active: {
      true: {},
      false: {},
    },
  },
  compoundVariants: [
    {
      variants: {
        type: 'fade',
        active: true,
      },
      style: { opacity: 1 },
    },
    {
      variants: {
        type: 'fade',
        active: false,
      },
      style: { opacity: 0 },
    },
  ],
  defaultVariants: {
    type: 'fade',
    active: false,
  },
});

export const sliderList = style({
  display: 'flex',

  selectors: {
    [`&:has(.${sliderItem.classNames.variants.type.carousel})`]: {
      position: 'relative',
      right: calc.multiply(itemIndexVar, '100%'),
      transition: 'all 800ms',
    },
  },
});

export const sliderLink = style({
  display: 'block',
  width: 'inherit',
  height: 'inherit',
  position: 'inherit',
});

export const sliderDotList = style({
  position: 'absolute',
  bottom: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: tokens.spacing['spacing-008'],
});

export const sliderDotItem = recipe({
  base: {
    width: tokens.sizing['sizing-008'],
    height: tokens.sizing['sizing-008'],
    backgroundColor: 'white',
    borderRadius: '50%',
  },
  variants: {
    active: {
      true: {
        cursor: 'initial',
      },
      false: {
        opacity: '0.6',
        cursor: 'pointer',
      },
    },
  },
});

export type SliderVariants = NonNullable<RecipeVariants<typeof sliderItem>>;

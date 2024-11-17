import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

import { ColorPalettes } from '@styles/palette';
import { sprinkles } from '@styles/sprinkles.css';
import { tokens } from '@styles/token.css';

export const categoryForm = style({
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.spacing['spacing-008'],
});

export const categoryButtonWrapper = style({
  display: 'flex',
  gap: tokens.spacing['spacing-004'],
  justifyContent: 'flex-end',
});

export const subCategoryForm = style({
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.spacing['spacing-004'],
});

export const subCategoryInputWrapper = style({
  width: '100%',
  display: 'flex',
  gap: tokens.spacing['spacing-004'],
  alignItems: 'center',
});

export const removeButton = recipe({
  base: {
    flexShrink: 0,
    width: tokens.sizing['sizing-024'],
    height: tokens.sizing['sizing-024'],
    backgroundColor: '#eae5dd',
    borderRadius: '50%',
    visibility: 'hidden',

    ':disabled': {
      opacity: '0.4',
    },
  },
  variants: {
    show: {
      true: {},
      false: {},
    },
  },
  compoundVariants: [
    {
      variants: {
        show: true,
      },
      style: [
        {
          selectors: {
            [`${subCategoryInputWrapper}:hover &`]: {
              visibility: 'visible',
            },
          },
        },
      ],
    },
  ],
});

export const subCategoryItemAddButton = recipe({
  base: {
    width: tokens.sizing['sizing-024'],
    height: tokens.sizing['sizing-024'],
    backgroundColor: '#eae5dd',
  },
  variants: {
    show: {
      true: {},
      false: {
        display: 'none',
      },
    },
  },
});

export const buttonIcon = style({
  fontSize: tokens.sizing['sizing-016'],
  color: ColorPalettes.Grey['40'],
});

export const categoryItemRemoveButtonWrapper = recipe({
  base: {
    width: tokens.sizing['sizing-048'],
    textAlign: 'center',
    backgroundColor: '#eae5dd',
  },
  variants: {
    show: {
      true: {},
      false: {
        visibility: 'hidden',
      },
    },
  },
});

export const categoryItemRemoveButton = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: tokens.sizing['sizing-024'],
  height: tokens.sizing['sizing-024'],
  borderRadius: '50%',
  backgroundColor: 'white',

  ':hover': {
    backgroundColor: ColorPalettes.Grey['90'],
  },
  ':disabled': {
    opacity: '0.4',
    pointerEvents: 'none',
  },
});

export const categoryItemAddButtonWrapper = style({
  position: 'relative',
  textAlign: 'center',
});

export const categoryItemAddButton = style({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',

  ':hover': {
    backgroundColor: ColorPalettes.Grey['90'],
  },
});

export const deleteMessage = style([
  sprinkles({
    padding: 'spacing-016',
    fontSize: 'font-size-014',
    marginBottom: 'spacing-024',
  }),
  {
    color: ColorPalettes.Grey['20'],
    backgroundColor: ColorPalettes.Red['80'],
  },
]);

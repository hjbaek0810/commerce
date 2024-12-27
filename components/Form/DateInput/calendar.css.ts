import { globalStyle, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

import { ColorPalettes } from '@styles/palette';
import { sprinkles } from '@styles/sprinkles.css';
import { tokens } from '@styles/token.css';
import { fontSize } from '@styles/tokens';

export const wrapper = style({
  position: 'relative',
  zIndex: tokens.zIndex['z-index-dropdown'],
});

export const wrapperClassName = recipe({
  base: { width: '100%' },
  variants: {
    isFocused: {
      true: {},
      false: {},
    },
  },
});

export const calenderWrapper = style({
  backgroundColor: 'white',
  border: `1px solid ${ColorPalettes.Grey['30']}`,
  borderRadius: '0.4rem',
  boxShadow: `0px 4px 8px 0px #37373733`,
});

export const week = style({
  fontSize: tokens.fontSize['font-size-014'],
  color: ColorPalettes.Grey['10'],
  margin: 0,
  width: '36px',
  height: '33px',
  selectors: {
    '&:before': {
      content: '',
      display: 'inline-block',
      height: '100%',
      verticalAlign: 'middle',
      marginTop: '1px',
    },
  },
});

export const day = style({
  fontSize: tokens.fontSize['font-size-014'],
  width: '36px',
  height: '36px',
  margin: 0,
  color: ColorPalettes.Grey['00'],
  backgroundColor: 'transparent',
  border: `1px solid transparent`,
  borderRadius: '0.4rem',
  selectors: {
    '&:before': {
      content: '',
      display: 'inline-block',
      height: '100%',
      verticalAlign: 'middle',
      marginTop: '1px',
    },
    '&[aria-disabled=true]': {
      color: ColorPalettes.Grey['20'],
      backgroundColor: 'transparent',
      opacity: 0.4,
    },
    '&[aria-disabled=false]:focus': {
      position: 'relative',
      outlineWidth: '0.3rem',
      outlineStyle: 'solid',
      outlineOffset: '1px',
    },
    '&[aria-disabled=false]:hover': {
      borderRadius: '0.4rem',
    },
    '&[aria-disabled=false][aria-selected=false]:hover': {
      backgroundColor: '#BFBFBF33',
    },
    '&[aria-disabled=false][aria-selected=false]:active': {
      backgroundColor: '#BFBFBF33',
      borderColor: '#BFBFBF33',
    },
    '&[aria-disabled=false][aria-selected=false]:focus': {
      outlineColor: '#BFBFBF66',
      borderColor: 'transparent',
    },
    '&[aria-disabled=false][aria-selected=false]:focus:hover': {
      backgroundColor: 'transparent',
    },
    '&[aria-disabled=false][aria-selected=true]': {
      backgroundColor: '#eae5dd',
    },
    '&[aria-disabled=false][aria-selected=true]:focus': {
      outlineColor: '#c5c1b9',
    },
    '&.react-datepicker__day--outside-month[aria-selected=false]': {
      color: ColorPalettes.Grey['20'],
    },
    // today
    '&.react-datepicker__day--today': {
      fontSize: tokens.fontSize['font-size-014'],
      fontWeight: 700,
    },
    '&.react-datepicker__day--today[aria-disabled=false][aria-selected=false]':
      {
        borderColor: ColorPalettes.Grey['20'],
      },
    // range
    '&.react-datepicker__day--range-start.react-datepicker__day--in-range[aria-disabled=false]':
      {
        borderRadius: `0.4rem 0 0 0.4rem`,
        backgroundColor: '#eae5dd',
      },
    '&.react-datepicker__day--range-end.react-datepicker__day--in-range[aria-disabled=false]':
      {
        borderRadius: `0 0.4rem 0.4rem 0`,
        backgroundColor: '#eae5dd',
      },
    '&.react-datepicker__day--range-start.react-datepicker__day--range-end.react-datepicker__day--in-range[aria-disabled=false]':
      {
        borderRadius: '0.4rem',
      },
    '&.react-datepicker__day--in-range[aria-disabled=false]': {
      borderRadius: 0,
      backgroundColor: '#c5c1b9',
    },
    '&.react-datepicker__day--selecting-range-start.react-datepicker__day--in-selecting-range[aria-disabled=false]':
      {
        borderRadius: `0.4rem 0 0 0.4rem`,
        backgroundColor: '#eae5dd',
      },
    '&.react-datepicker__day--selecting-range-end.react-datepicker__day--in-selecting-range[aria-disabled=false]':
      {
        borderRadius: `0 0.4rem 0.4rem 0`,
        backgroundColor: '#eae5dd',
      },
    '&.react-datepicker__day--selecting-range-start.react-datepicker__day--selecting-range-end.react-datepicker__day--in-selecting-range[aria-disabled=false]':
      {
        borderRadius: '0.4rem',
      },
    '&.react-datepicker__day--in-selecting-range[aria-disabled=false]': {
      borderRadius: 0,
      backgroundColor: '#c5c1b9',
    },
  },
});

export const headerWrapper = style([
  sprinkles({
    paddingX: 'spacing-016',
    paddingY: 'spacing-012',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }),
  {
    backgroundColor: '#eae5dd',
    borderBottom: `1px solid ${ColorPalettes.Grey['30']}`,
  },
]);

export const headerSelectorsWrapper = style({
  display: 'flex',
  gap: tokens.spacing['spacing-008'],
});

export const headerSelector = style([
  sprinkles({
    paddingX: 'spacing-004',
    paddingY: 'spacing-012',
    fontSize: 'font-size-014',
    fontWeight: 'bold',
  }),
  {
    backgroundColor: 'transparent',
    cursor: 'pointer',
  },
]);

globalStyle('.react-datepicker__header', {
  padding: 0,
  border: 0,
  backgroundColor: 'white',
});

globalStyle('.react-datepicker__month', {
  margin: 0,
  paddingTop: tokens.spacing['spacing-002'],
  paddingRight: tokens.spacing['spacing-016'],
  paddingLeft: tokens.spacing['spacing-016'],
  paddingBottom: tokens.spacing['spacing-008'],
});

globalStyle('.react-datepicker__day-names', {
  paddingLeft: tokens.spacing['spacing-016'],
  paddingRight: tokens.spacing['spacing-016'],
  paddingTop: tokens.spacing['spacing-008'],
  marginBottom: 0,
});

globalStyle('.react-datepicker__today-button', {
  padding: 0,
  background: 'initial',
  borderColor: ColorPalettes.Grey['60'],
});

globalStyle('.react-datepicker__tab-loop', {
  position: 'relative',
  zIndex: tokens.zIndex['z-index-sticky'],
});

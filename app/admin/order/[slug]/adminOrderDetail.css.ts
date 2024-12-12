import { style } from '@vanilla-extract/css';

import { ColorPalettes } from '@styles/palette';
import { sprinkles } from '@styles/sprinkles.css';
import { tokens } from '@styles/token.css';

export const orderWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.spacing['spacing-032'],
});

export const orderManageWrapper = style({
  display: 'flex',
  gap: tokens.spacing['spacing-024'],
});

export const orderInfoWrapper = style([
  sprinkles({
    paddingX: 'spacing-016',
    paddingY: 'spacing-024',
    fontSize: 'font-size-014',
  }),
  {
    width: '60%',
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacing['spacing-024'],
    color: ColorPalettes.Grey['30'],
    fontWeight: 600,
    border: `2px solid ${ColorPalettes.Grey['60']}`,
  },
]);

export const orderInfoBoxWrapper = style({
  display: 'flex',
  gap: tokens.spacing['spacing-012'],
  justifyContent: 'space-between',
});

export const orderInfoBox = style({
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.spacing['spacing-004'],
  width: '100%',
});

export const orderInfoValue = style({
  display: 'inline-block',
  paddingLeft: tokens.spacing['spacing-004'],
  color: ColorPalettes.Grey['10'],
});

export const orderStatusWrapper = style({
  width: '40%',
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.spacing['spacing-012'],
  padding: tokens.spacing['spacing-012'],
  backgroundColor: '#F3F3F3',
  border: `2px solid ${ColorPalettes.Grey['80']}`,
});

export const orderStatusBox = style({
  alignSelf: 'center',
});

export const orderStatusRadioWrapper = style({
  display: 'flex',
  gap: tokens.spacing['spacing-008'],
  justifyContent: 'center',
});

export const imageWrapper = style({
  position: 'relative',
  height: '15vw',
});

export const totalPrice = style({
  display: 'block',
  fontWeight: '800',
  fontSize: tokens.fontSize['font-size-016'],
  textAlign: 'end',
});

export const addressWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.spacing['spacing-004'],
});

export const paymentTypeWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.spacing['spacing-004'],
});

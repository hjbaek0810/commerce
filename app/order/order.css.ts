import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

import { ColorPalettes } from '@styles/palette';
import { sprinkles } from '@styles/sprinkles.css';
import { tokens } from '@styles/token.css';
import { OrderStatus } from '@utils/constants/order';

export const orderWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.spacing['spacing-056'],
});

export const orderProductWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.spacing['spacing-008'],
});

export const orderInfoWrapper = style({
  display: 'flex',
  gap: tokens.spacing['spacing-008'],
  justifyContent: 'space-between',
});

export const statusBadge = recipe({
  base: [
    sprinkles({
      display: 'inline-block',
      paddingX: 'spacing-016',
      paddingY: 'spacing-012',
      fontSize: 'font-size-016',
      fontWeight: 'bold',
    }),
    {
      alignSelf: 'flex-end',
      backgroundColor: 'pink',
      borderRadius: '0.5rem',
    },
  ],
  variants: {
    status: {
      [OrderStatus.ORDER_CANCELLED]: {
        color: '#721C24',
        backgroundColor: '#F8D7DA',
      },
      // [OrderStatus.ORDER_PENDING]: {
      //   color: '#856404',
      //   backgroundColor: '#FFF3CD',
      // },
      [OrderStatus.PAYMENT_PENDING]: {
        color: '#8A6D3B',
        backgroundColor: '#FFEC99',
      },
      [OrderStatus.PAYMENT_COMPLETED]: {
        color: '#155724',
        backgroundColor: '#D4EDDA',
      },
      [OrderStatus.SHIPPING_IN_PROGRESS]: {
        color: '#004085',
        backgroundColor: '#B8DAFF',
      },
      [OrderStatus.SHIPPING_PENDING]: {
        color: '#1D4E89',
        backgroundColor: '#E2F1FF',
      },
      [OrderStatus.SHIPPING_COMPLETED]: {
        color: '#155724',
        backgroundColor: '#C3E6CB',
      },
      [OrderStatus.REFUND_PENDING]: {
        color: '#856404',
        backgroundColor: '#FFEeba',
      },
      [OrderStatus.REFUND_COMPLETED]: {
        color: '#155724',
        backgroundColor: '#D4EDDA',
      },
      [OrderStatus.RETURN_PENDING]: {
        color: '#856404',
        backgroundColor: '#FFF3CD',
      },
      [OrderStatus.RETURN_COMPLETED]: {
        color: '#155724',
        backgroundColor: '#D4EDDA',
      },
    },
  },
});

export const orderItemWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.spacing['spacing-048'],
  paddingBottom: tokens.spacing['spacing-056'],
  borderBottom: `2px solid ${ColorPalettes.Grey['80']}`,
  ':last-child': {
    paddingBottom: 0,
    borderBottom: 0,
  },
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

export const emptyOrderListWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
});

export const emptyOrderList = style({
  width: '50%',
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.spacing['spacing-024'],
  textAlign: 'center',
});

export const emptyCartIcon = style({
  fontSize: tokens.sizing['sizing-128'],
  color: ColorPalettes.Grey['80'],
});

export const emptyText = style({
  fontSize: tokens.fontSize['font-size-016'],
  color: ColorPalettes.Grey['50'],
});

export const userButtonWrapper = style({
  display: 'flex',
  justifyContent: 'center',
});

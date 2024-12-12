import { recipe } from '@vanilla-extract/recipes';

import { sprinkles } from '@styles/sprinkles.css';
import { OrderStatus } from '@utils/constants/order';

import type { RecipeVariants } from '@vanilla-extract/recipes';

export const statusBadge = recipe({
  base: {
    display: 'inline-block',
    alignSelf: 'flex-end',
    borderRadius: '0.5rem',
    fontWeight: 'bold',
  },
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
    size: {
      small: sprinkles({
        display: 'inline-block',
        paddingX: 'spacing-012',
        paddingY: 'spacing-008',
        fontSize: 'font-size-012',
        fontWeight: 'bold',
      }),
      large: sprinkles({
        display: 'inline-block',
        paddingX: 'spacing-016',
        paddingY: 'spacing-012',
        fontSize: 'font-size-016',
        fontWeight: 'bold',
      }),
    },
    full: {
      true: {
        width: '100%',
        textAlign: 'center',
      },
      false: {},
    },
  },
  defaultVariants: {
    size: 'large',
    full: false,
  },
});

export type OrderStatusBadgeVariants = Pick<
  NonNullable<RecipeVariants<typeof statusBadge>>,
  'size' | 'full'
>;

import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

import { tokens } from '@styles/token.css';

export const signInWrapper = style({
  width: '50%',
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.spacing['spacing-040'],
  justifyContent: 'center',
  alignItems: 'center',
  margin: '0 auto',
  height: '100%',
});

export const signInForm = style({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.spacing['spacing-016'],
});

export const createAccountLink = recipe({
  base: {
    color: '#1C78C7',
    fontSize: tokens.fontSize['font-size-014'],
    fontWeight: 600,
    textAlign: 'end',
  },
  variants: {
    disabled: {
      true: {},
      false: {
        opacity: 0.4,
        pointerEvents: 'none',
      },
    },
  },
  defaultVariants: {
    disabled: false,
  },
});

import { keyframes, style } from '@vanilla-extract/css';

import { ColorPalettes } from '@styles/palette';
import { tokens } from '@styles/token.css';

const rotate = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

const rotateWithBackdrop = keyframes({
  '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
  '100%': { transform: 'translate(-50%, -50%) rotate(360deg)' },
});

export const backdropWrapper = style({
  position: 'relative',
  width: '100%',
  // height: '100%',
  height: tokens.sizing['sizing-320'],
  zIndex: tokens.zIndex['z-index-overlay'],
});

export const loading = style({
  color: ColorPalettes.Grey['60'],
  fontSize: tokens.sizing['sizing-048'],
  animationName: rotate,
  animationDuration: '800ms',
  animationTimingFunction: 'linear',
  animationIterationCount: 'infinite',

  selectors: {
    [`${backdropWrapper} &`]: {
      animationName: rotateWithBackdrop,
      position: 'absolute',
      top: '50%',
      left: '50%',
    },
  },
});

import { style } from '@vanilla-extract/css';

import { tokens } from '@styles/token.css';

export const likeButton = style({
  position: 'absolute',
  top: '1rem',
  right: '1rem',
});

export const likeIcon = style({
  fontSize: tokens.sizing['sizing-024'],
  color: '#ff7878',
});

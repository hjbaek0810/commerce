import { style } from '@vanilla-extract/css';

import { ColorPalettes } from '@styles/palette';
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

export const emptyWishListWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
});

export const emptyWishList = style({
  width: '50%',
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.spacing['spacing-024'],
  textAlign: 'center',
});

export const emptyHeartIcon = style({
  fontSize: tokens.sizing['sizing-128'],
  color: '#ff7878',
  opacity: 0.4,
});

export const emptyText = style({
  fontSize: tokens.fontSize['font-size-016'],
  color: ColorPalettes.Grey['50'],
});

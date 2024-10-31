import { createVar, style } from '@vanilla-extract/css';

import { tokens } from '@styles/token.css';

export const textareaHeightVar = createVar();

export const textareaWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.spacing['spacing-008'],
});

export const textarea = style({
  overflow: 'hidden',
  resize: 'none',
  height: textareaHeightVar,
});

export const strLengthWrapper = style({
  display: 'block',
  textAlign: 'end',
  fontSize: tokens.fontSize['font-size-012'],
});

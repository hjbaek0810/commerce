import { globalStyle } from '@vanilla-extract/css';

globalStyle('*', {
  margin: 0,
  padding: 0,
  color: 'inherit',
});

globalStyle('*, :after, :before', {
  boxSizing: 'border-box',
});

globalStyle(':root', {
  WebkitTapHighlightColor: 'transparent',
  WebkitTextSizeAdjust: '100%',
  textSizeAdjust: '100%',
  cursor: 'default',
  lineHeight: 1.5,
  overflowWrap: 'break-word',
  wordBreak: 'break-word',
  tabSize: 4,
});

globalStyle('html', {
  fontSize: '62.5%',
});

globalStyle('html, body', {
  height: '100%',
});

globalStyle('img, picture, video, canvas, svg', {
  display: 'block',
  maxWidth: '100%',
});

globalStyle('button', {
  background: 'transparent',
  border: 0,
  cursor: 'pointer',
});

globalStyle('button:disabled', {
  cursor: 'default',
});

globalStyle('a', {
  textDecoration: 'none',
});

globalStyle('table', {
  borderCollapse: 'collapse',
  borderSpacing: 0,
});

globalStyle('dl, menu, ol, ul', {
  listStyle: 'none',
});

globalStyle('input, textarea, select, button', {
  appearance: 'none',
  MozAppearance: 'none',
  WebkitAppearance: 'none',
  border: 0,
  borderRadius: 0,
  outline: 'none',
  verticalAlign: 'middle',
});

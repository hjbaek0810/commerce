import { sprinkles } from '@styles/sprinkles.css';

export const wrapper = sprinkles({
  display: 'flex',
  flexDirection: 'column',
  gap: 'spacing-024',
  alignItems: 'flex-end',
});

export const searchFilterWrapper = sprinkles({
  display: 'flex',
  flexDirection: 'column',
  gap: 'spacing-024',
  alignItems: 'center',
});

export const resetWithFilterWrapper = sprinkles({
  display: 'flex',
  flexDirection: 'column',
  gap: 'spacing-012',
  alignItems: 'flex-end',
});

export const sortSelectWrapper = sprinkles({
  width: 'sizing-half',
  alignSelf: 'flex-end',
});

export const gridWrapper = sprinkles({
  display: 'flex',
  flexDirection: 'column',
  gap: 'spacing-004',
  alignItems: 'flex-end',
});

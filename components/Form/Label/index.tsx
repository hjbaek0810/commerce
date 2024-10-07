import type { PropsWithChildren } from 'react';

import * as css from './label.css';

import type { LabelVariants } from './label.css';

export type LabelPropsType = {
  name?: string;
  required?: boolean;
} & LabelVariants;

const Label = ({
  name,
  required,
  error,
  children,
}: PropsWithChildren<LabelPropsType>) => (
  <label htmlFor={name} className={css.label({ error })}>
    {children}
    {required && <span className={css.star}>*</span>}
  </label>
);

export default Label;

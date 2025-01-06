import type { PropsWithChildren } from 'react';

import * as css from './label.css';

import type { LabelVariants } from './label.css';

export type LabelPropsType = {
  name?: string;
  required?: boolean;
  isLegend?: boolean;
} & LabelVariants;

const Label = ({
  name,
  required,
  error,
  isLegend,
  children,
}: PropsWithChildren<LabelPropsType>) => {
  const labelContent = (
    <>
      {children}
      {required && <span className={css.star}>*</span>}
    </>
  );

  if (isLegend) {
    return <legend className={css.label({ error })}>{labelContent}</legend>;
  }

  return (
    <label htmlFor={name} className={css.label({ error })}>
      {labelContent}
    </label>
  );
};

export default Label;

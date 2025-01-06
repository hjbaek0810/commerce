import type { PropsWithChildren } from 'react';
import { get, useFormContext } from 'react-hook-form';

import { isEmpty } from 'lodash-es';

import Label from '@components/Form/Label';

import type { LabelPropsType } from '@components/Form/Label';

type RHFLabelPropsType = Pick<LabelPropsType, 'name' | 'required' | 'isLegend'>;

const RHFLabel = ({
  name,
  isLegend,
  required,
  children,
}: PropsWithChildren<RHFLabelPropsType>) => {
  const {
    formState: { errors },
  } = useFormContext();

  const error = get(errors, name);

  return (
    <Label
      name={name}
      required={required}
      error={!isEmpty(error)}
      isLegend={isLegend}
    >
      {children}
    </Label>
  );
};

export default RHFLabel;

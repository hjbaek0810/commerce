import type { ChangeEvent, FocusEvent } from 'react';
import type { FieldValues, Path } from 'react-hook-form';
import { get, useFormContext } from 'react-hook-form';

import { isEmpty } from 'lodash-es';

import { type CommonRHFPropsType, RHFRules } from '@components/Form';

import Select from '.';

import type { SelectPropsType } from '.';

type RHFSelectPropsType<T extends FieldValues> = CommonRHFPropsType<
  SelectPropsType,
  T
> & { resetErrorOnBlur?: boolean };

const RHFSelect = <T extends FieldValues>({
  name = '' as Path<T>,
  rules,
  required,
  onChange,
  onBlur,
  resetErrorOnBlur = false,
  ...restProps
}: RHFSelectPropsType<T>) => {
  const {
    register,
    formState: { errors },
    clearErrors,
  } = useFormContext<T>();

  const error = get(errors, name);

  const selectRegister = register(name, RHFRules(rules, required));

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    selectRegister.onChange(event);
    onChange?.(event);
  };

  const handleBlur = (event: FocusEvent<HTMLSelectElement>) => {
    if (resetErrorOnBlur && error) clearErrors(name);

    selectRegister.onBlur(event);
    onBlur?.(event);
  };

  return (
    <Select
      {...restProps}
      {...selectRegister}
      error={!isEmpty(error)}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
};

export default RHFSelect;

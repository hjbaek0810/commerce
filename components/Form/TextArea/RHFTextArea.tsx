import type { ChangeEvent, FocusEvent } from 'react';
import type { FieldValues, Path } from 'react-hook-form';
import { get, useFormContext, useWatch } from 'react-hook-form';

import { isEmpty } from 'lodash-es';

import TextArea from '.';
import { RHFRules } from '..';

import type { TextAreaPropsType } from '.';
import type { CommonRHFPropsType } from '..';

type RHFTextAreaPropsType<T extends FieldValues> = CommonRHFPropsType<
  TextAreaPropsType,
  T
> & { resetErrorOnBlur?: boolean };

const RHFTextArea = <T extends FieldValues>({
  name = '' as Path<T>,
  rules,
  required,
  onChange,
  onBlur,
  resetErrorOnBlur = false,
  ...restProps
}: RHFTextAreaPropsType<T>) => {
  const {
    register,
    formState: { errors },
    clearErrors,
    control,
  } = useFormContext<T>();

  const curValue = useWatch({
    name,
    control,
  });

  const error = get(errors, name);

  const textareaRegister = register(name, RHFRules(rules, required));

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    textareaRegister.onChange(event);
    onChange?.(event);
  };

  const handleBlur = (event: FocusEvent<HTMLTextAreaElement>) => {
    if (resetErrorOnBlur && error) clearErrors(name);

    textareaRegister.onBlur(event);
    onBlur?.(event);
  };

  return (
    <TextArea
      {...restProps}
      {...textareaRegister}
      curLength={curValue?.length}
      error={!isEmpty(error)}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
};

export default RHFTextArea;

import type { ChangeEvent } from 'react';
import {
  type FieldValues,
  type Path,
  get,
  useFormContext,
} from 'react-hook-form';

import { isEmpty } from 'lodash-es';

import FileUpload from '.';
import { RHFRules } from '..';

import type { FileUploadPropsType } from '.';
import type { CommonRHFPropsType } from '..';

type RHFInputPropsType<T extends FieldValues> = CommonRHFPropsType<
  FileUploadPropsType,
  T
> & { required?: boolean };

const RHFFileUpload = <T extends FieldValues>({
  name = '' as Path<T>,
  rules,
  required,
  onChange,
  ...restProps
}: RHFInputPropsType<T>) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<T>();

  const error = get(errors, name);

  const fileRegister = register(name, RHFRules(rules, required));

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    fileRegister.onChange(event);
    onChange?.(event);
  };

  return (
    <FileUpload
      {...restProps}
      {...fileRegister}
      error={!isEmpty(error)}
      onChange={handleChange}
    />
  );
};

export default RHFFileUpload;

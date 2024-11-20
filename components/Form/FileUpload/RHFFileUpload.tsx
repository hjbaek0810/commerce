import type { ChangeEvent } from 'react';
import type {
  type FieldValues,
  type Path,
  PathValue,
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
    setValue,
    formState: { errors },
  } = useFormContext<T>();

  const error = get(errors, name);

  const fileRegister = register(name, RHFRules(rules, required));

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    fileRegister.onChange(event);
    onChange?.(event);
  };

  const handleUpdateFile = (value: null | FileList) => {
    setValue(name, value as PathValue<T, Path<T>>);
  };

  return (
    <FileUpload
      {...restProps}
      {...fileRegister}
      error={!isEmpty(error)}
      onChange={handleChange}
      onUpdateFile={handleUpdateFile}
    />
  );
};

export default RHFFileUpload;

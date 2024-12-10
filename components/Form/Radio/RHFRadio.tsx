import type { PropsWithChildren } from 'react';
import { createContext, useContext, useMemo } from 'react';
import type { FieldValues, Path, UseControllerReturn } from 'react-hook-form';
import { useController, useFormContext } from 'react-hook-form';

import { isEmpty, isUndefined } from 'lodash-es';

import Radio from '.';
import { RHFRules } from '..';

import type { RadioPropsType } from '.';
import type { CommonRHFPropsType } from '..';

type RHFRadioGroupPropsType<T extends FieldValues> = CommonRHFPropsType<
  Pick<RadioPropsType, 'name' | 'required' | 'disabled'>,
  T
> & { className?: string };

type RHFRadioPropsType = Omit<RadioPropsType, 'checked' | 'error'>;

type RadioStateType<T extends FieldValues, U extends Path<T>> = {
  controller: UseControllerReturn<T, U>;
  disabled?: boolean;
};

const RadioContext = createContext<RadioStateType<any, any> | null>(null);

const useRadioContext = <T extends FieldValues>() => {
  const context = useContext<RadioStateType<T, Path<T>> | null>(RadioContext);

  if (!context) {
    throw new Error(
      'useRadioContext should be used within RadioContext.Provider',
    );
  }

  return context;
};

export const RHFRadioGroup = <T extends FieldValues>({
  name = '' as Path<T>,
  rules,
  required,
  disabled,
  className,
  children,
}: PropsWithChildren<RHFRadioGroupPropsType<T>>) => {
  const { control } = useFormContext<T>();

  const controller = useController<T, string & Path<T>>({
    name,
    control,
    rules: RHFRules(rules, required),
  });

  const value = useMemo(
    () => ({ controller, disabled }),
    [controller, disabled],
  );

  return (
    <RadioContext.Provider value={value}>
      <div className={className}>{children}</div>
    </RadioContext.Provider>
  );
};

export const RHFRadio = (props: RHFRadioPropsType) => {
  const { value, onChange, disabled, ...restProps } = props;

  const { controller, disabled: groupDisabled } = useRadioContext();
  const {
    field,
    fieldState: { error },
  } = controller;

  const handleChange = () => {
    if (field.value === value) return;

    field.onChange(value);
    onChange?.();
  };

  return (
    <Radio
      {...restProps}
      {...field}
      value={value}
      onChange={handleChange}
      checked={field.value === value}
      disabled={isUndefined(groupDisabled) ? disabled : groupDisabled}
      error={!isEmpty(error)}
    />
  );
};

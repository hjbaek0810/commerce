import type { PropsWithChildren } from 'react';
import { createContext, useContext, useEffect, useMemo } from 'react';
import type { RegisterOptions, UseControllerReturn } from 'react-hook-form';
import { useController, useFormContext } from 'react-hook-form';

import { isEmpty } from 'lodash-es';

import { RHFRules } from '@components/Form';
import Checkbox from '@components/Form/Checkbox';
import useCheckbox from '@components/Form/Checkbox/useCheckbox';

import type {
  CheckboxChangeEvent,
  CheckboxPropsType,
} from '@components/Form/Checkbox';
import type {
  GetCheckboxPropsType,
  UseCheckboxPropsType,
} from '@components/Form/Checkbox/useCheckbox';

type CheckboxStateType = ReturnType<typeof useCheckbox> & {
  controller: UseControllerReturn;
};

const CheckboxContext = createContext<CheckboxStateType | null>(null);

const useCheckboxContext = () => {
  const context = useContext(CheckboxContext);

  if (!context) {
    throw new Error(
      'useCheckbox should be used within CheckboxContext.Provider',
    );
  }

  return context;
};

type RHFCheckboxGroupPropsType = UseCheckboxPropsType & {
  rules?: RegisterOptions;
  required?: boolean;
};

export const RHFCheckboxGroup = ({
  name = '',
  options,
  rules,
  children,
  required,
}: PropsWithChildren<RHFCheckboxGroupPropsType>) => {
  const checkboxState = useCheckbox({ name, options });

  const { control } = useFormContext();

  const controller = useController({
    name,
    control,
    rules: RHFRules(rules, required),
  });

  const value = useMemo(
    () => ({
      ...checkboxState,
      controller,
    }),
    [checkboxState, controller],
  );

  return (
    <CheckboxContext.Provider value={value}>
      {children}
    </CheckboxContext.Provider>
  );
};

type RHFCheckboxPropsType = Pick<
  CheckboxPropsType,
  'label' | 'value' | 'partiallyChecked' | 'onChange'
>;

export const RHFCheckbox = ({
  label,
  value,
  partiallyChecked = false,
  onChange,
}: RHFCheckboxPropsType) => {
  const {
    controller,
    updateCheckedValue,
    getCheckboxProps,
    getPartiallyCheckedCheckboxProps,
  } = useCheckboxContext();

  const {
    field,
    fieldState: { error },
  } = controller;

  let checkboxProps: GetCheckboxPropsType;

  if (partiallyChecked) {
    checkboxProps = getPartiallyCheckedCheckboxProps();
  } else {
    checkboxProps = getCheckboxProps(value ?? '');
  }

  const isFieldChecked = field.value?.includes(checkboxProps.value) ?? false;

  const handleCheckboxChange = (event: CheckboxChangeEvent) => {
    checkboxProps.onChange(updatedCheckedValues => {
      field.onChange(updatedCheckedValues);
    });

    onChange?.(event);
  };

  useEffect(() => {
    if (checkboxProps.checked === isFieldChecked) return;
    if (value) updateCheckedValue(value);
  }, [checkboxProps.checked, isFieldChecked, updateCheckedValue, value]);

  return (
    <Checkbox
      label={label}
      {...checkboxProps}
      error={!isEmpty(error)}
      onChange={handleCheckboxChange}
      value={field.value}
    />
  );
};

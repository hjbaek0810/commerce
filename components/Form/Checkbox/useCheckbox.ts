import { useCallback, useEffect, useState } from 'react';

import { isEqual } from 'lodash-es';

import ListController from '@utils/controller/list';

import type { CheckboxValueType } from '@components/Form/Checkbox';

export type CheckboxChangeHandlerType = (
  callback?: (updatedCheckedValues: CheckboxValueType[]) => void,
) => void;

export type GetCheckboxPropsReturnType = {
  name?: string;
  value: CheckboxValueType;
  checked: boolean;
  onChange: CheckboxChangeHandlerType;
};

export type GetIndeterminateCheckboxPropsReturnType = Omit<
  GetCheckboxPropsReturnType,
  'value'
> & {
  value?: CheckboxValueType;
  indeterminate: boolean | null;
};

export type GetCheckboxPropsType =
  | GetCheckboxPropsReturnType
  | GetIndeterminateCheckboxPropsReturnType;

export type UseCheckboxPropsType = {
  name?: string;
  options: CheckboxValueType[];
  defaultCheckedValues?: CheckboxValueType[];
};

const useCheckbox = ({
  name,
  options,
  defaultCheckedValues,
}: UseCheckboxPropsType) => {
  const [checkedValues, setCheckedValues] = useState<CheckboxValueType[]>(
    defaultCheckedValues ?? [],
  );

  useEffect(() => {
    if (defaultCheckedValues && !isEqual(defaultCheckedValues, checkedValues)) {
      setCheckedValues(defaultCheckedValues);
    }
  }, [checkedValues, defaultCheckedValues]);

  const isChecked = useCallback(
    (value: CheckboxValueType) => checkedValues.includes(value),
    [checkedValues],
  );

  const isAllChecked = useCallback(
    () => ListController(checkedValues).equal(options),
    [checkedValues, options],
  );

  const isIndeterminate = () => {
    if (ListController(checkedValues).isEmpty()) return null;

    return !isAllChecked();
  };

  const toggleChecked = useCallback(
    (value: CheckboxValueType) =>
      (prevCheckedValues = checkedValues) => {
        if (isChecked(value))
          return ListController(prevCheckedValues).remove(value).get();

        return ListController(prevCheckedValues).add(value).get();
      },
    [checkedValues, isChecked],
  );

  const toggleAllChecked = useCallback(
    () => (isAllChecked() ? [] : options),
    [isAllChecked, options],
  );

  const updateCheckedValue = useCallback(
    (value: CheckboxValueType) => setCheckedValues(toggleChecked(value)),
    [toggleChecked],
  );

  const resetCheckedValues = () => {
    setCheckedValues([]);
  };

  const handleCheckboxChange =
    (value: CheckboxValueType): CheckboxChangeHandlerType =>
    callback => {
      const updatedCheckedValues = toggleChecked(value)();
      setCheckedValues(updatedCheckedValues);
      callback?.(updatedCheckedValues);
    };

  const handleIndeterminateCheckboxChange: CheckboxChangeHandlerType =
    callback => {
      const updatedCheckedValues = toggleAllChecked();
      setCheckedValues(updatedCheckedValues);
      callback?.(updatedCheckedValues);
    };

  const getCheckboxProps = (
    value: CheckboxValueType,
  ): GetCheckboxPropsReturnType => ({
    name,
    value,
    checked: isChecked(value),
    onChange: handleCheckboxChange(value),
  });

  const getIndeterminateCheckboxProps = (
    value?: CheckboxValueType,
  ): GetIndeterminateCheckboxPropsReturnType => ({
    name,
    value,
    checked: isAllChecked(),
    onChange: handleIndeterminateCheckboxChange,
    indeterminate: isIndeterminate(),
  });

  return {
    checkedValues,
    isChecked,
    isAllChecked,
    updateCheckedValue,
    resetCheckedValues,
    getCheckboxProps,
    getIndeterminateCheckboxProps,
  };
};

export default useCheckbox;

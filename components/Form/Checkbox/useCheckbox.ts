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

export type getPartiallyCheckedCheckboxPropsReturnType = Omit<
  GetCheckboxPropsReturnType,
  'value'
> & {
  value?: CheckboxValueType;
  partiallyChecked: boolean | null;
};

export type GetCheckboxPropsType =
  | GetCheckboxPropsReturnType
  | getPartiallyCheckedCheckboxPropsReturnType;

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

  const isAllChecked = useCallback(() => {
    if (options.length === 0 && checkedValues.length === 0) {
      return false;
    }

    return options.every(item => checkedValues.includes(item));
    // return ListController(checkedValues).equal(options);
  }, [checkedValues, options]);

  const isPartiallyChecked = () => {
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

  const toggleAllChecked = useCallback(() => {
    if (isAllChecked()) {
      return checkedValues.filter(item => !options.includes(item));
    } else {
      return [...checkedValues, ...options];
    }
  }, [isAllChecked, options, checkedValues]);

  // const toggleAllChecked = useCallback(
  //   () => (isAllChecked() ? [] : options),
  //   [isAllChecked, options],
  // );

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

  const handlePartiallyCheckedCheckboxChange: CheckboxChangeHandlerType =
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

  const getPartiallyCheckedCheckboxProps = (
    value?: CheckboxValueType,
  ): getPartiallyCheckedCheckboxPropsReturnType => ({
    name,
    value,
    checked: isAllChecked(),
    onChange: handlePartiallyCheckedCheckboxChange,
    partiallyChecked: isPartiallyChecked(),
  });

  return {
    checkedValues,
    isChecked,
    isAllChecked,
    updateCheckedValue,
    resetCheckedValues,
    getCheckboxProps,
    getPartiallyCheckedCheckboxProps,
  };
};

export default useCheckbox;

import { useCallback, useState } from 'react';

export type CheckedValueType = string | number | undefined;

const useRadio = () => {
  const [checkedValue, setCheckedValue] = useState<CheckedValueType>();

  const updateCheckedValue = useCallback((value: CheckedValueType) => {
    setCheckedValue(value);
  }, []);

  const isChecked = (value: CheckedValueType) => checkedValue === value;

  return { checkedValue, isChecked, updateCheckedValue };
};

export default useRadio;

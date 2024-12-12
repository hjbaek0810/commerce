import { forwardRef } from 'react';
import type { InputHTMLAttributes, KeyboardEvent } from 'react';

import * as css from './radio.css';

import type { RadioVariants } from './radio.css';
import type { CheckedValueType } from './useRadio';

export type RadioPropsType = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'defaultValue' | 'defaultChecked' | 'readOnly' | 'value'
> & {
  error?: boolean;
  onChange?: () => void;
  value: CheckedValueType;
} & RadioVariants;

const Radio = forwardRef<HTMLInputElement, RadioPropsType>(
  (
    {
      id,
      name,
      children,
      value,
      checked = false,
      error = false,
      disabled = false,
      onChange,
      ...restProps
    },
    ref,
  ) => {
    const labelId = `${name}-${value}`;

    const handleLabelClick = () => {
      onChange?.();
    };

    const handleLabelKeyDown = (event: KeyboardEvent) => {
      if (!event.defaultPrevented) {
        if (event.key === 'Enter') {
          onChange?.();
        }
      }
    };

    return (
      <div
        className={css.radioWrapper({ disabled })}
        role="radio"
        tabIndex={disabled ? -1 : 0}
        aria-checked={checked}
        aria-labelledby={labelId}
        onClick={handleLabelClick}
        onKeyDown={handleLabelKeyDown}
      >
        <input
          {...restProps}
          className={css.radio({ error })}
          id={id ?? `${name}-${value}`}
          name={name}
          type="radio"
          tabIndex={-1}
          onChange={onChange}
          disabled={disabled}
          checked={checked}
          ref={ref}
        />
        {children && (
          <span id={labelId} className={css.label}>
            {children}
          </span>
        )}
      </div>
    );
  },
);

Radio.displayName = 'Radio';

export default Radio;

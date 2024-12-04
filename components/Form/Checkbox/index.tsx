import type { InputHTMLAttributes, KeyboardEvent } from 'react';
import { forwardRef } from 'react';

import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import * as css from './checkbox.css';

import type { ListValueType } from '@components/Form/Checkbox/controller';

export type CheckboxValueType = ListValueType;

export type CheckboxPropsType = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value'
> & {
  label?: string;
  value?: CheckboxValueType;
  error?: boolean;
  indeterminate?: boolean | null;
  onChange?: () => void;
};

const Checkbox = forwardRef<HTMLInputElement, CheckboxPropsType>(
  (
    {
      name,
      label,
      value,
      indeterminate,
      error = false,
      checked = false,
      disabled = false,
      onChange,
      ...restProps
    },
    ref,
  ) => {
    const labelId = `${name}-label`;

    const handleLabelClick = () => {
      if (disabled) return;
      onChange?.();
    };

    const handleLabelKeyDown = (event: KeyboardEvent) => {
      if (disabled) return;

      if (!event.defaultPrevented) {
        if (event.key === 'Enter') {
          onChange?.();
        }
      }
    };

    return (
      <div
        className={css.checkboxWrapper}
        role="checkbox"
        tabIndex={0}
        aria-checked={checked}
        aria-labelledby={labelId}
        onClick={handleLabelClick}
        onKeyDown={handleLabelKeyDown}
      >
        <div className={css.checkbox({ checked, error })}>
          <input
            className={css.input}
            id={name}
            name={name}
            type="checkbox"
            tabIndex={-1}
            disabled={disabled}
            checked={checked}
            onChange={onChange}
            ref={ref}
            {...restProps}
          />
          {(checked || indeterminate) && (
            <FontAwesomeIcon icon={faCheck} className={css.checkboxIcon} />
          )}
        </div>
        {label && (
          <span className={css.label} id={labelId}>
            {label}
          </span>
        )}
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;

import type {
  ChangeEvent,
  InputHTMLAttributes,
  KeyboardEvent,
  MouseEvent,
} from 'react';
import { forwardRef } from 'react';

import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import * as css from './checkbox.css';

import type { ListValueType } from '@utils/controller/list';

export type CheckboxValueType = ListValueType;

export type CheckboxChangeEvent =
  | MouseEvent<HTMLDivElement>
  | KeyboardEvent
  | ChangeEvent<HTMLInputElement>;

export type CheckboxPropsType = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value'
> & {
  label?: string;
  value?: CheckboxValueType;
  error?: boolean;
  partiallyChecked?: boolean | null;
  onChange?: (event: CheckboxChangeEvent) => void;
};

const Checkbox = forwardRef<HTMLInputElement, CheckboxPropsType>(
  (
    {
      id,
      name,
      label,
      value,
      partiallyChecked,
      error = false,
      checked = false,
      disabled = false,
      onChange,
      ...restProps
    },
    ref,
  ) => {
    const labelId = `${name}-${value}`;

    const handleLabelClick = (event: MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      onChange?.(event);
    };

    const handleLabelKeyDown = (event: KeyboardEvent) => {
      if (disabled) return;

      if (!event.defaultPrevented) {
        if (event.key === 'Enter') {
          onChange?.(event);
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
            id={id || labelId}
            name={name}
            type="checkbox"
            tabIndex={-1}
            disabled={disabled}
            checked={checked}
            onChange={onChange}
            ref={ref}
            {...restProps}
          />
          {(checked || partiallyChecked) && (
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

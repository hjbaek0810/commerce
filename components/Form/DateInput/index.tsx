import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';

import {
  faCalendarDay,
  faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import * as inputCss from '@components/Form/Input/input.css';

import * as css from './dateInput.css';

import type { InputVariants } from '@components/Form/Input/input.css';

export type DateInputPropsType = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'color'
> &
  InputVariants;

const DateInput = forwardRef<HTMLInputElement, DateInputPropsType>(
  (
    {
      error,
      autoComplete = 'off',
      name,
      hidden = false,
      placeholder,
      disabled = false,
      ...restProps
    },
    ref,
  ) => {
    return (
      <div className={inputCss.inputWrapper({ hidden })}>
        <input
          {...restProps}
          type="text"
          name={name}
          className={inputCss.input({ error })}
          disabled={disabled}
          placeholder={disabled ? '' : placeholder}
          data-error={error}
          autoComplete={autoComplete}
          ref={ref}
          hidden={hidden}
        />
        {!disabled && (
          <FontAwesomeIcon icon={faCalendarDay} className={css.calendarIcon} />
        )}

        {error && (
          <FontAwesomeIcon
            className={inputCss.errorIcon}
            icon={faExclamationCircle}
          />
        )}
      </div>
    );
  },
);

DateInput.displayName = 'DateInput';

export default DateInput;

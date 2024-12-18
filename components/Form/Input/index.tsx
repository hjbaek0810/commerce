import { type InputHTMLAttributes, forwardRef } from 'react';

import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import * as css from './input.css';

import type { InputVariants } from './input.css';

export type InputPropsType = InputHTMLAttributes<HTMLInputElement> &
  InputVariants;

const Input = forwardRef<HTMLInputElement, InputPropsType>(
  (
    {
      error,
      type = 'text',
      autoComplete = 'off',
      name,
      hidden = false,
      placeholder,
      ...restProps
    },
    ref,
  ) => {
    return (
      <div className={css.inputWrapper({ hidden })}>
        <input
          {...restProps}
          id={name}
          name={name}
          placeholder={restProps.disabled ? '' : placeholder}
          className={css.input({ error })}
          type={type}
          autoComplete={autoComplete}
          ref={ref}
          hidden={hidden}
        />
        {error && (
          <FontAwesomeIcon
            className={css.errorIcon}
            icon={faExclamationCircle}
          />
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;

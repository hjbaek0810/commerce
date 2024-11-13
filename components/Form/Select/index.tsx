import type { PropsWithChildren, SelectHTMLAttributes } from 'react';
import { forwardRef } from 'react';

import {
  faAngleDown,
  faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';

import * as inputCss from '@components/Form/Input/input.css';

import * as css from './select.css';

import type { SelectVariants } from './select.css';

type SelectOptionsType = {
  value: any;
};

export type SelectPropsType = SelectHTMLAttributes<HTMLSelectElement> &
  SelectVariants;

const SelectComponent = forwardRef<HTMLSelectElement, SelectPropsType>(
  (
    {
      name,
      className,
      disabled = false,
      error = false,
      hidden = false,
      children,
      ...restProps
    },
    ref,
  ) => {
    return (
      <div
        className={clsx(
          inputCss.inputWrapper({ hidden }),
          css.selectWrapper,
          className,
        )}
      >
        <select
          name={name}
          className={inputCss.input({ error })}
          disabled={disabled}
          ref={ref}
          defaultValue=""
          {...restProps}
        >
          <option value="" disabled hidden>
            Please select type
          </option>
          {children}
        </select>

        {error && (
          <FontAwesomeIcon
            className={inputCss.errorIcon}
            icon={faExclamationCircle}
          />
        )}
        {!disabled && (
          <FontAwesomeIcon
            className={css.selectArrowIcon({ error })}
            icon={faAngleDown}
          />
        )}
      </div>
    );
  },
);

SelectComponent.displayName = 'SelectComponent';

const SelectOption = ({
  children,
  value,
}: PropsWithChildren<SelectOptionsType>) => {
  return (
    <option key={value} value={value}>
      {children}
    </option>
  );
};

const Select = Object.assign(SelectComponent, {
  Option: SelectOption,
});

export default Select;

import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

import clsx from 'clsx';

import * as css from './button.css';

import type { ButtonVariants } from './button.css';

type ButtonPropsType = ButtonHTMLAttributes<HTMLButtonElement> & ButtonVariants;

const Button = ({
  type = 'button',
  size = 'small',
  color = 'theme',
  fill = false,
  fullWidth = false,
  className,
  children,
  ...restProps
}: PropsWithChildren<ButtonPropsType>) => {
  return (
    <button
      className={clsx(css.button({ size, color, fill, fullWidth }), className)}
      type={type}
      {...restProps}
    >
      {children}
    </button>
  );
};

export default Button;

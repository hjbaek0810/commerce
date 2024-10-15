import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

import * as css from './button.css';

import type { ButtonVariants } from './button.css';

type ButtonPropsType = ButtonHTMLAttributes<HTMLButtonElement> & ButtonVariants;

const Button = ({
  type = 'button',
  size = 'small',
  color = 'theme',
  fill = false,
  fullWidth = false,
  children,
  ...restProps
}: PropsWithChildren<ButtonPropsType>) => {
  return (
    <button
      className={css.button({ size, color, fill, fullWidth })}
      type={type}
      {...restProps}
    >
      {children}
    </button>
  );
};

export default Button;

import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

import clsx from 'clsx';
import Link from 'next/link';

import * as css from './button.css';

import type { ButtonVariants } from './button.css';
import type { ParsedUrlQueryInput } from 'querystring';

type ButtonPropsType = ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonVariants & {
    href?: {
      pathname: string;
      query?: ParsedUrlQueryInput | string;
      prefetch?: boolean;
    };
  };

const Button = ({
  type = 'button',
  size = 'small',
  color = 'theme',
  fill = false,
  fullWidth = false,
  className,
  children,
  href,
  disabled,
  ...restProps
}: PropsWithChildren<ButtonPropsType>) => {
  if (href) {
    const { prefetch, ...restHref } = href;

    return (
      <Link
        href={restHref}
        prefetch={prefetch}
        className={clsx(
          css.button({ size, color, fill, fullWidth, disabled }),
          className,
        )}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      className={clsx(
        css.button({ size, color, fill, fullWidth, disabled }),
        className,
      )}
      type={type}
      disabled={disabled}
      {...restProps}
    >
      {children}
    </button>
  );
};

export default Button;

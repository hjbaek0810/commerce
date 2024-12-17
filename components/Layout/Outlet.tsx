'use client';

import type { PropsWithChildren } from 'react';

import { usePathname } from 'next/navigation';

import * as css from './layout.css';

import type { OutletVariants } from './layout.css';

type OutletPropsType = Pick<OutletVariants, 'fullHeight'> & {
  isPadded?: boolean;
};

const Outlet = ({
  children,
  fullHeight = false,
  isPadded,
}: PropsWithChildren<OutletPropsType>) => {
  const pathname = usePathname();

  return (
    <section
      className={css.outlet({
        isPadded: isPadded ?? pathname !== '/',
        fullHeight,
      })}
    >
      {children}
    </section>
  );
};

export default Outlet;

'use client';

import type { PropsWithChildren } from 'react';

import { usePathname } from 'next/navigation';

import * as css from './layout.css';

import type { OutletVariants } from './layout.css';

type OutletPropsType = Pick<OutletVariants, 'fullHeight'>;

const Outlet = ({
  children,
  fullHeight = false,
}: PropsWithChildren<OutletPropsType>) => {
  const pathname = usePathname();

  return (
    <section
      className={css.outlet({
        isPadded: pathname !== '/',
        fullHeight,
      })}
    >
      {children}
    </section>
  );
};

export default Outlet;

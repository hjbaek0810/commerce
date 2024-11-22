import type { PropsWithChildren } from 'react';

import * as css from './layout.css';

const Outlet = ({ children }: PropsWithChildren) => {
  return <section className={css.outlet}>{children}</section>;
};

export default Outlet;

import type { CSSProperties, PropsWithChildren } from 'react';

import * as css from './layout.css';

const Outlet = ({
  children,
  style,
}: PropsWithChildren & { style?: CSSProperties }) => (
  <section style={style} className={css.outlet}>
    {children}
  </section>
);

export default Outlet;

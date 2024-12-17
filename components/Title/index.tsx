import type { PropsWithChildren } from 'react';

import * as css from './title.css';

import type { TitleVariants } from './title.css';

const Title = ({
  size = 'large',
  align = 'start',
  children,
}: PropsWithChildren<TitleVariants>) => {
  return <h2 className={css.title({ size, align })}>{children}</h2>;
};

export default Title;

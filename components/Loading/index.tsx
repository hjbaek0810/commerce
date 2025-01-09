import type { PropsWithChildren } from 'react';

import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import * as css from '@components/Loading/loading.css';

const Backdrop = ({ children }: PropsWithChildren) => (
  <div className={css.backdropWrapper}>{children}</div>
);

const Spinner = () => {
  return <FontAwesomeIcon icon={faSpinner} className={css.loading} />;
};

// const Loading = Object.assign(LoadingSpinner, {
//   Backdrop: LoadingBackdrop,
// });

const LoadingSpinner = () => (
  <Backdrop>
    <Spinner />
  </Backdrop>
);

export default LoadingSpinner;

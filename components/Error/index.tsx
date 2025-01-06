import type { PropsWithChildren } from 'react';

import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import * as css from '@styles/error.css';

import type { IconProp } from '@fortawesome/fontawesome-svg-core';

const ErrorBox = ({ children }: PropsWithChildren) => (
  <div className={css.errorContainer}>{children}</div>
);

const ErrorMessage = ({ children }: PropsWithChildren) => (
  <p className={css.errorText}>{children}</p>
);

const ErrorIcon = ({ icon }: { icon?: IconProp }) => (
  <FontAwesomeIcon
    className={css.errorIcon}
    icon={icon || faCircleExclamation}
  />
);

const Error = Object.assign(ErrorBox, {
  Message: ErrorMessage,
  Icon: ErrorIcon,
});

export default Error;

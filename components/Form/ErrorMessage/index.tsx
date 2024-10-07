import { useFormContext } from 'react-hook-form';

import { ErrorMessage } from '@hookform/error-message';
import clsx from 'clsx';

import * as css from './errorMessage.css';
type RhfErrorMessagePropsType = {
  name: string;
  fixedMessage?: string;
  className?: string;
};

const RHFErrorMessage = ({
  name,
  fixedMessage,
  className,
}: RhfErrorMessagePropsType) => {
  const {
    formState: { errors },
  } = useFormContext();

  return (
    <ErrorMessage
      name={name}
      errors={errors}
      render={({ message }) => (
        <p className={clsx(css.message, className)}>
          {fixedMessage ?? message}
        </p>
      )}
      // render={({ messages }) =>
      //   messages &&
      //   Object.entries(messages).map(([type, message]) => (
      //     <p key={type}>{message}</p>
      //   ))
      // }
    />
  );
};

export default RHFErrorMessage;

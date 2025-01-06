'use client';

import { useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';

import { useRouter } from 'next/navigation';

import { CommonErrorException, SessionErrorException } from '@api/exception';
import NotFound from '@app/not-found';
import Button from '@components/Button';
import Error from '@components/Error';
import { isApiError } from '@services/utils/error';
import { PATH } from '@utils/path';

type ErrorBoundaryPropsType = {
  error: Error;
  reset: () => void;
};

const ErrorBoundary = ({ error, reset }: ErrorBoundaryPropsType) => {
  const router = useRouter();

  const handleSessionError = useCallback(() => {
    toast.info('세션이 만료되었습니다. 다시 로그인 해주시기 바랍니다.', {
      pauseOnFocusLoss: false,
      pauseOnHover: false,
      toastId: 'retry-login',
    });
    router.push(PATH.SIGN_IN);
  }, [router]);

  useEffect(() => {
    if (isApiError(error)) {
      const { code } = error;

      if (
        code &&
        [
          SessionErrorException.SESSION_NOT_FOUND.code,
          SessionErrorException.EXPIRED_SESSION.code,
          SessionErrorException.UNKNOWN_ERROR.code,
          SessionErrorException.FORBIDDEN_ACCESS.code,
        ].includes(code)
      ) {
        handleSessionError();
      }
    }
  }, [error, handleSessionError]);

  if (isApiError(error)) {
    const { code } = error;

    if (code === CommonErrorException.NOT_FOUND.code) {
      return <NotFound />;
    }

    return (
      <Error>
        <Error.Icon />
        <Error.Message>
          서버에서 예상치 못한 오류가 발생했습니다.
          <br />
          다시 시도하거나 고객센터에 문의해주세요.
        </Error.Message>
        <Button size="medium" fill onClick={() => reset()}>
          Retry
        </Button>
      </Error>
    );
  }

  return (
    <Error>
      <Error.Icon />
      <Error.Message>
        잠시 문제가 발생했습니다.
        <br />
        다시 시도하거나 고객센터에 문의해주세요.
      </Error.Message>
      <Button size="medium" fill onClick={() => reset()}>
        Retry
      </Button>
    </Error>
  );
};

export default ErrorBoundary;

'use client';

import { useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { CommonErrorException, SessionErrorException } from '@api/exception';
import NotFound from '@app/not-found';
import Button from '@components/Button';
import Error from '@components/Error';
import { isApiError } from '@services/utils/error';
import { sprinkles } from '@styles/sprinkles.css';
import { PATH } from '@utils/path';

type ErrorBoundaryPropsType = {
  error: Error;
  reset: () => void;
};

// TODO: 에러 페이지가 기존 레이아웃 밖에 생성되므로 사이드메뉴를 유지한 상태로 에러 페이지를 보이도록 수정하기..
const ErrorBoundary = ({ error, reset }: ErrorBoundaryPropsType) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleSessionError = useCallback(() => {
    queryClient.removeQueries();
    toast.info('세션이 만료되었습니다. 다시 로그인 해주시기 바랍니다.', {
      pauseOnFocusLoss: false,
      pauseOnHover: false,
      toastId: 'retry-login',
    });
    router.push(PATH.SIGN_IN);
  }, [queryClient, router]);

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
        <div
          className={sprinkles({
            display: 'flex',
            gap: 'spacing-008',
            width: 'sizing-fill',
            justifyContent: 'center',
          })}
        >
          <Button size="medium" fill onClick={() => router.back()}>
            Back
          </Button>
          <Button size="medium" fill onClick={() => reset()}>
            Retry
          </Button>
        </div>
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
      <div
        className={sprinkles({
          display: 'flex',
          gap: 'spacing-008',
          width: 'sizing-fill',
          justifyContent: 'center',
        })}
      >
        <Button size="medium" fill onClick={() => router.back()}>
          Back
        </Button>
        <Button size="medium" fill onClick={() => reset()}>
          Retry
        </Button>
      </div>
    </Error>
  );
};

export default ErrorBoundary;

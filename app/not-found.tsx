'use client';

import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';

import Button from '@components/Button';
import Error from '@components/Error';
import { sprinkles } from '@styles/sprinkles.css';

const NotFound = () => {
  const router = useRouter();

  const handleGoHomeButtonClick = () => {
    router.replace('/');
  };

  const handleGoBackButtonClick = () => {
    router.back();
  };

  return (
    <Error>
      <Error.Icon icon={faCircleQuestion} />
      <Error.Message>요청하신 페이지는 존재하지 않습니다.</Error.Message>

      <div
        className={sprinkles({
          display: 'flex',
          gap: 'spacing-008',
          width: 'sizing-fill',
          justifyContent: 'center',
        })}
      >
        <Button size="medium" onClick={handleGoBackButtonClick}>
          돌아가기
        </Button>
        <Button size="medium" onClick={handleGoHomeButtonClick}>
          홈으로
        </Button>
      </div>
    </Error>
  );
};

export default NotFound;

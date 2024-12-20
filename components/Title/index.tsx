'use client';

import type { PropsWithChildren } from 'react';

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';

import Button from '@components/Button';

import * as css from './title.css';

import type { TitleVariants } from './title.css';

const Title = ({
  size = 'large',
  align = 'start',
  showBackButton = false,
  children,
}: PropsWithChildren<TitleVariants> & { showBackButton?: boolean }) => {
  const router = useRouter();

  return (
    <div className={css.titleWrapper}>
      {showBackButton && (
        <Button
          size="small"
          className={css.backButton}
          onClick={() => router.back()}
        >
          <FontAwesomeIcon className={css.backButtonIcon} icon={faArrowLeft} />
        </Button>
      )}
      <h2 className={css.title({ size, align })}>{children}</h2>
    </div>
  );
};

export default Title;

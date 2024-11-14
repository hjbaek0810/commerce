import type { ReactNode } from 'react';

import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from '@components/Button';
import Modal from '@components/Modal';
import { ColorPalettes } from '@styles/palette';
import { sprinkles } from '@styles/sprinkles.css';
import { tokens } from '@styles/token.css';

import type { CustomModalPropsType } from '../types';

type PromptModalPropsType = {
  title?: string;
  message: string | ReactNode;
} & CustomModalPropsType;

const PromptModal = ({
  title = 'Notice',
  message,
  onClose,
  onSubmit,
}: PromptModalPropsType) => {
  return (
    <Modal>
      <Modal.Header>{title}</Modal.Header>
      <Modal.Body>
        <div
          className={sprinkles({
            display: 'flex',
            flexDirection: 'column',
            gap: 'spacing-024',
            alignItems: 'center',
          })}
        >
          <FontAwesomeIcon
            icon={faCircleExclamation}
            style={{
              color: ColorPalettes.Grey['70'],
              fontSize: tokens.sizing['sizing-056'],
            }}
          />
          <p>{message}</p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button size="medium" onClick={onClose}>
          No, cancel
        </Button>
        <Button size="medium" fill onClick={onSubmit}>
          Yes, I&apos;m sure
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PromptModal;

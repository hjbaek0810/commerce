import type { Address } from 'react-daum-postcode';
import DaumPostCode from 'react-daum-postcode';

import Button from '@components/Button';
import Modal from '@components/Modal';

import type { CustomModalPropsType } from '@components/Modal/types';

type FindPostCodeModalPropsType = {
  onSubmit: (address: Address) => void;
} & Pick<CustomModalPropsType, 'onClose'>;

const FindPostCodeModal = ({
  onSubmit,
  onClose,
}: FindPostCodeModalPropsType) => {
  return (
    <Modal>
      <Modal.Header>Find Post Code</Modal.Header>
      <Modal.Body>
        <DaumPostCode style={{ height: '45rem' }} onComplete={onSubmit} />
      </Modal.Body>
      <Modal.Footer>
        <Button size="medium" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FindPostCodeModal;

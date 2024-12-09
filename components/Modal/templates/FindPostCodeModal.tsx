import type { Address } from 'react-daum-postcode';
import DaumPostCode from 'react-daum-postcode';

import Modal from '@components/Modal';

type FindPostCodeModalPropsType = {
  onSubmit: (address: Address) => void;
};

const FindPostCodeModal = ({ onSubmit }: FindPostCodeModalPropsType) => {
  return (
    <Modal>
      <Modal.Header>Find Post Code</Modal.Header>
      <Modal.Body>
        <DaumPostCode style={{ height: '45rem' }} onComplete={onSubmit} />
      </Modal.Body>
    </Modal>
  );
};

export default FindPostCodeModal;

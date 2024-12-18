import type { FormEvent } from 'react';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { useSession } from 'next-auth/react';

import FindPostCodeModal from '@components/Modal/templates/FindPostCodeModal';
import useModals from '@utils/hooks/useModals';
import { formatPhoneNumber } from '@utils/validation';

const useAccountForm = () => {
  const accountForm = useForm();
  const { setValue, control, reset } = accountForm;
  const { data: session } = useSession();
  const [editable, setEditable] = useState<boolean>(false);

  const { openModal } = useModals();

  const passwordValue = useWatch({
    name: 'password',
    control,
  });

  const isCustomUser = session?.provider === 'credentials';
  const onlyCustomUserEditable = isCustomUser && editable;

  const handleEditClick = () => {
    setEditable(true);
  };

  const handleCancelClick = () => {
    setEditable(false);
    // reset(defaultValue);
  };

  const handleTelephoneInput = (event: FormEvent<HTMLInputElement>) => {
    const formattedPhoneNumber = formatPhoneNumber(event.currentTarget.value);
    setValue('telephone', formattedPhoneNumber);
  };

  const handleFindPostCodeButtonClick = () => {
    openModal(FindPostCodeModal, {
      onSubmit: data => {
        setValue('postCode', data.zonecode);
        setValue('address', data.address);
      },
    });
  };

  return {
    accountForm,
    isCustomUser,
    editable,
    onlyCustomUserEditable,
    passwordValue,
    handleTelephoneInput,
    handleCancelClick,
    handleEditClick,
    handleFindPostCodeButtonClick,
    isPending: false, // FIXME
  };
};

export default useAccountForm;

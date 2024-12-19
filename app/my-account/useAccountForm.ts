import type { FormEvent } from 'react';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { useSession } from 'next-auth/react';

import FindPostCodeModal from '@components/Modal/templates/FindPostCodeModal';
import { useMyAccountQuery } from '@services/queries/user';
import useModals from '@utils/hooks/useModals';
import { formatPhoneNumber } from '@utils/validation';

import type { UpdateUser } from '@api/user/types/dto';

type AccountUseFormType = UpdateUser & {
  name?: string;
  loginId?: string;
  confirmPassword?: string;
};

const useAccountForm = () => {
  const { data: myInfo } = useMyAccountQuery();

  const defaultValue = {
    name: myInfo?.name,
    loginId: myInfo?.loginId,
    email: myInfo?.email || '',
    telephone: myInfo?.telephone || '',
    postCode: myInfo?.postCode || '',
    address: myInfo?.address || '',
    subAddress: myInfo?.subAddress || '',
  };

  const accountForm = useForm<AccountUseFormType>({
    values: defaultValue,
  });

  const { setValue, control, reset } = accountForm;
  const passwordValue = useWatch({
    name: 'password',
    control,
  });

  const { data: session } = useSession();

  const [editablePassword, setEditablePassword] = useState<boolean>(false);
  const [editable, setEditable] = useState<boolean>(false);

  const { openModal } = useModals();

  const isCustomUser = session?.provider === 'credentials';
  const onlyCustomUserEditable = isCustomUser && editable;

  const handleEditClick = () => {
    setEditable(true);
  };

  const handleCancelClick = () => {
    setEditable(false);
    setEditablePassword(false);
    reset(defaultValue);
  };

  const handleUpdatePasswordButtonClick = () => {
    if (editablePassword) setValue('password', '');

    setEditablePassword(prev => !prev);
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
        setValue('subAddress', '');
      },
    });
  };

  return {
    accountForm,
    isCustomUser,
    editable,
    onlyCustomUserEditable,
    passwordValue,
    editablePassword,
    handleUpdatePasswordButtonClick,
    handleTelephoneInput,
    handleCancelClick,
    handleEditClick,
    handleFindPostCodeButtonClick,
    isPending: false, // FIXME
  };
};

export default useAccountForm;

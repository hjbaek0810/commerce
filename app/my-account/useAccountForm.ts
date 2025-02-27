import type { FormEvent } from 'react';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-toastify';

import { useQueryClient } from '@tanstack/react-query';

import FindPostCodeModal from '@components/Modal/templates/FindPostCodeModal';
import {
  useMyAccountMutation,
  useMyAccountQuery,
} from '@services/queries/user';
import { userKeys } from '@services/queries/user/keys';
import { UserLoginType } from '@utils/constants/user';
import useModals from '@utils/hooks/useModals';
import { formatPhoneNumber } from '@utils/validation';

import type { UpdateUser } from '@api/user/types/dto';
import type { UserVO } from '@api/user/types/vo';

type AccountUseFormType = UpdateUser & {
  name?: string;
  loginId?: string;
  confirmPassword?: string;
};

const useAccountForm = () => {
  const { data: myInfo } = useMyAccountQuery();
  const { mutate: updateMyAccount, isPending } = useMyAccountMutation();
  const queryClient = useQueryClient();

  const [editablePassword, setEditablePassword] = useState<boolean>(false);
  const [editable, setEditable] = useState<boolean>(false);

  const { openModal } = useModals();

  const isCustomUser = myInfo?.loginType === UserLoginType.CREDENTIALS;
  const onlyCustomUserEditable = isCustomUser && editable;

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

  const handleUpdateMyAccount = (data: AccountUseFormType) => {
    const { name, loginId, confirmPassword, email, ...requestData } = data;

    updateMyAccount(
      {
        ...requestData,
        ...(isCustomUser && { email }),
      },
      {
        onSuccess: () => {
          setEditable(false);
          setEditablePassword(false);
          queryClient.setQueryData<UserVO>(userKeys.getDetail(), previous => {
            if (!previous) return myInfo;
            const { password, ...updatedData } = requestData;

            return {
              ...previous,
              ...updatedData,
            };
          });
        },
      },
    );
  };

  return {
    accountForm,
    isCustomUser,
    editable,
    onlyCustomUserEditable,
    passwordValue,
    editablePassword,
    isPending,
    handleUpdatePasswordButtonClick,
    handleTelephoneInput,
    handleCancelClick,
    handleEditClick,
    handleFindPostCodeButtonClick,
    handleUpdateMyAccount,
  };
};

export default useAccountForm;

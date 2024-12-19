import type { FormEvent } from 'react';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-toastify';

import { useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

import FindPostCodeModal from '@components/Modal/templates/FindPostCodeModal';
import {
  useMyAccountMutation,
  useMyAccountQuery,
} from '@services/queries/user';
import { userKeys } from '@services/queries/user/keys';
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

  const { data: session } = useSession();

  const [editablePassword, setEditablePassword] = useState<boolean>(false);
  const [editable, setEditable] = useState<boolean>(false);

  const { openModal } = useModals();

  const isCustomUser = session?.provider === 'credentials';
  const onlyCustomUserEditable = isCustomUser && editable;

  const defaultValue = {
    name: myInfo?.name,
    loginId: myInfo?.loginId,
    contactEmail: isCustomUser ? myInfo?.contactEmail : myInfo?.email || '',
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
    const { name, loginId, confirmPassword, contactEmail, ...requestData } =
      data;

    updateMyAccount(
      {
        ...requestData,
        ...(isCustomUser && { contactEmail }),
      },
      {
        onSuccess: () => {
          setEditable(false);
          setEditablePassword(false);
          queryClient.setQueryData<UserVO>(userKeys.getDetail(), previous => {
            if (!previous) return myInfo;

            return {
              ...previous,
              ...requestData,
            };
          });
        },
        onError: () => {
          toast.error(
            '사용자 정보 수정에 실패했습니다. 다시 시도해주시기 바랍니다.',
          );
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

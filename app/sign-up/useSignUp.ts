import type { FormEvent } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-toastify';

import { useRouter } from 'next/navigation';

import { UserErrorException } from '@api/exception';
import FindPostCodeModal from '@components/Modal/templates/FindPostCodeModal';
import { useSignUpMutation } from '@services/queries/user';
import { isApiError } from '@services/utils/error';
import { UserRoleType } from '@utils/constants/user';
import useModals from '@utils/hooks/useModals';
import { PATH } from '@utils/path';
import { formatPhoneNumber } from '@utils/validation';

import type { CreateUser } from '@api/user/types/dto';

type SignUpUseFormType = CreateUser & { confirmPassword: string };

const useSignUp = () => {
  const { mutate: signUp } = useSignUpMutation();
  const router = useRouter();
  const signUpForm = useForm<SignUpUseFormType>({
    defaultValues: {
      role: UserRoleType.USER,
    },
  });

  const { openModal } = useModals();

  const { setValue, setError, control } = signUpForm;
  const passwordValue = useWatch({
    name: 'password',
    control,
  });

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

  const handleSignUpSubmit = (data: SignUpUseFormType) => {
    const { confirmPassword, ...requestData } = data;

    signUp(requestData, {
      onSuccess: () => {
        router.push(PATH.SIGN_IN);
      },
      onError: error => {
        if (isApiError(error)) {
          if (error.code === UserErrorException.USER_ALREADY_EXISTS.code) {
            toast.error('이미 존재하는 아이디입니다.');
            setError(
              'loginId',
              {},
              {
                shouldFocus: true,
              },
            );
          }
        }
      },
    });
  };

  return {
    signUpForm,
    passwordValue,
    handleTelephoneInput,
    handleFindPostCodeButtonClick,
    handleSignUpSubmit,
  };
};

export default useSignUp;

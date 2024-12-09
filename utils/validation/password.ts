// const REG_PASSWORD_LENGTH = /^.{8,16}$/;

import {
  REG_CONTINUOUS_DIGITS,
  REG_UPPER_LOWER_CASE_LETTERS,
} from '@utils/regExp';

// const isCorrectLength = (value: string) => REG_PASSWORD_LENGTH.test(value);

const hasNumber = (value: string) => REG_CONTINUOUS_DIGITS.test(value);

const hasLowercaseAndUppercaseLetter = (value: string) =>
  REG_UPPER_LOWER_CASE_LETTERS.test(value);

export const passwordRules = {
  required: true,
  minLength: {
    value: 8,
    message: '8자 이상으로 조합하십시오.',
  },
  maxLength: {
    value: 16,
    message: '16자까지 입력 가능합니다.',
  },
  validate: (value: string) =>
    (hasNumber(value) && hasLowercaseAndUppercaseLetter(value)) ||
    '영문 대소문자/숫자 모두 포함해서 조합하십시오.',
};

export const isConfirmPasswordValidate = ({
  password,
  confirmPassword,
}: {
  password: string;
  confirmPassword: string;
}) => {
  if (password && confirmPassword === password) return true;

  return '비밀번호가 일치하지 않습니다.';
};

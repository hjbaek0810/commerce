const REG_EMAIL =
  /^([A-Za-z0-9]+([-_.]?[A-Za-z0-9])*)@([A-Za-z0-9]+([-]?[A-Za-z0-9])*)(\.([A-Za-z0-9]+([-]?[A-Za-z0-9])*))?(\.([A-Za-z0-9]([-]?[A-Za-z0-9])*))?((\.[A-Za-z]{2,63})$)/;

const MAX_LENGTH = 50;

export const emailRules = {
  required: true,
  pattern: {
    value: REG_EMAIL,
    message: '이메일 형식이 올바르지 않습니다.',
  },
  maxLength: {
    value: MAX_LENGTH,
    message: '최대 50자까지 가능합니다.',
  },
};

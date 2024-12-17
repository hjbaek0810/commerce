const REG_LOGIN_ID = /^[a-zA-Z0-9][a-zA-Z0-9_-]{5,15}$/;

// const MIN_LENGTH = 6;
// const MAX_LENGTH = 16;

export const loginIdRules = {
  pattern: {
    value: REG_LOGIN_ID,
    message:
      '아이디는 6자에서 16자 사이여야 하며, 영어 대소문자, 숫자, 특수문자(-, _)만 사용할 수 있습니다.',
  },
};

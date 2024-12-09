export const PHONE_MAX_LENGTH = 13;

const REG_PHONE_PATTERN =
  /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?[0-9]{3,4}-?[0-9]{4}$/;

export function formatPhoneNumber(value: string) {
  return value
    .replace(/[^0-9]/g, '') // 숫자만 남기기
    .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/, '$1-$2-$3') // 포맷팅 적용
    .replace(/-+$/g, ''); // 마지막 하이픈 제거
}

export const telephoneRules = {
  require: true,
  maxLength: PHONE_MAX_LENGTH,
  pattern: {
    value: REG_PHONE_PATTERN,
    message: '연락처 형식이 올바르지 않습니다.',
  },
};

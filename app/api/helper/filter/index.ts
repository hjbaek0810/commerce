export function shouldFilterKey(
  key: string,
  value: string,
  additionalExcludedKeys: string[] = [],
) {
  const defaultExcludedKeys = ['page', 'limit', 'sort'];
  const allExcludedKeys = [...defaultExcludedKeys, ...additionalExcludedKeys]; // 기본 키 + 추가 키

  return value && !allExcludedKeys.includes(key);
}

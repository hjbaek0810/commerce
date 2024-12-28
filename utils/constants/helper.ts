export const createEnumObject = <T extends Record<string, string>>(e: T) => {
  return Object.keys(e).reduce(
    (acc, key) => {
      acc[key as keyof T] = e[key];

      return acc;
    },
    {} as Record<keyof T, string>,
  );
};

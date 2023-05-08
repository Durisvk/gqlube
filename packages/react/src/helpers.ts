export const pick = <T extends object, K extends keyof T>(
  obj: T,
  ...keys: K[] | [K[]]
): Pick<T, K> => {
  const k = (Array.isArray(keys[0]) ? keys[0] : keys) as K[];
  const result = {} as Pick<T, K>;
  k.forEach((key) => {
    result[key] = obj[key];
  });
  return result;
};

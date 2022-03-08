export const applyAliasesToObject = <TKey extends string, TAlias extends string, TValue>(
  obj: Record<TKey, TValue>,
  aliases?: Partial<Record<TKey, TAlias>>,
): Record<TKey, TValue> | Record<TAlias | TKey, TValue> => {
  if (!aliases) return obj;

  return Object.entries(obj).reduce((result, [key, value]) => {
    return { ...result, [aliases[key as TKey] ?? key]: value };
  }, {} as Record<TAlias | TKey, TValue>);
};

export const accessNestedField = <T extends object, R extends any = any>(
  obj: T,
  path: string[],
  field: string,
) => {
  let pointer: any = obj;
  for (const subpath of path) {
    if (isObject(pointer)) {
      pointer = pointer[subpath as keyof typeof pointer];
    } else return;
  }

  return isObject(pointer) ? pointer[field as keyof typeof pointer] : undefined;
};

export const isObject = (obj: any): obj is object => typeof obj === 'object' && obj !== null;

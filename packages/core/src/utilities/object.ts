export const applyAliasesToObject = <TKey extends string, TAlias extends string, TValue>(
  obj: Record<TKey, TValue>,
  aliases?: Partial<Record<TKey, TAlias>>,
): Record<TKey, TValue> | Record<TAlias | TKey, TValue> => {
  if (!aliases) return obj;

  return Object.entries(obj).reduce((result, [key, value]) => {
    return { ...result, [aliases[key as TKey] ?? key]: value };
  }, {} as Record<TAlias | TKey, TValue>);
};

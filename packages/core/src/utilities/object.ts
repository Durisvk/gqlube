import { ReadonlyOrNotReadonlyArray } from "./array";

export const applyAliasesToObject = <
  TKey extends string,
  TAlias extends string,
  TValue
>(
  obj: Record<TKey, TValue>,
  aliases?: Partial<Record<TKey, TAlias>>
): Record<TKey, TValue> | Record<TAlias | TKey, TValue> => {
  if (!aliases) return obj;

  return Object.entries(obj).reduce((result, [key, value]) => {
    return { ...result, [aliases[key as TKey] ?? key]: value };
  }, {} as Record<TAlias | TKey, TValue>);
};

export type AccessNestedFieldType<
  TObj extends object,
  TPath extends ReadonlyOrNotReadonlyArray<string[]>,
  TField extends string
> = TPath extends ReadonlyOrNotReadonlyArray<[]>
  ? TField extends keyof TObj
    ? TObj[TField]
    : undefined
  : TPath extends ReadonlyOrNotReadonlyArray<[infer Head, ...infer Tail]>
  ? Head extends keyof TObj
    ? Tail extends ReadonlyOrNotReadonlyArray<string[]>
      ? TObj[Head] extends infer Obj
        ? Obj extends object
          ? AccessNestedFieldType<Obj, Tail, TField>
          : undefined
        : undefined
      : undefined
    : undefined
  : never;

export const accessNestedField = <
  TObj extends object,
  TPath extends ReadonlyOrNotReadonlyArray<string[]>,
  TField extends string
>(
  obj: TObj,
  path: TPath,
  field: TField
): AccessNestedFieldType<TObj, TPath, TField> => {
  type Result = AccessNestedFieldType<TObj, TPath, TField>;
  let pointer: any = obj;
  for (const subpath of path) {
    if (isObject(pointer) && subpath in pointer) {
      pointer = pointer[subpath as keyof typeof pointer] as any;
    } else return undefined as Result;
  }

  return isObject(pointer) && field in pointer
    ? pointer[field as keyof typeof pointer]
    : undefined;
};

type IsObject<T> = T extends object ? (T extends null ? false : true) : false;
export const isObject = <T extends any>(obj: T): IsObject<T> =>
  (typeof obj === "object" && obj !== null) as IsObject<T>;

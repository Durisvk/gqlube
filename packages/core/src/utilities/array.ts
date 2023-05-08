export type ReadonlyOrNotReadonlyArray<T extends any> = T extends ReadonlyArray<
  infer U
>
  ? ReadonlyArray<U>
  : T;

export const restAndTail = <T extends readonly any[]>(
  arr: T
): T extends ReadonlyOrNotReadonlyArray<[...infer Rest, infer Tail]>
  ? Tail extends NonNullable<Tail>
    ? [Rest, Tail]
    : [Rest]
  : [T] => {
  const rest = arr.slice(0, arr.length - 1);
  const tail = [...arr].pop();

  if (!tail) return [rest] as any;
  return [rest, tail] as any;
};

const x = restAndTail([1, 2, 3, 4, 5]);

export const restAndTail = <T>(arr: T[]): [T[], T] | [T[]] => {
  const rest = arr.slice(0, arr.length - 1);
  const tail = [...arr].pop();

  if (!tail) return [rest];
  return [rest, tail];
};

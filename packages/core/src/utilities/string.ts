export const capitalize = (str: string) => `${str.charAt(0).toUpperCase()}${str.slice(1)}`;

export const indent = (level: number, indentation = '  ') => {
  return indentation.repeat(level);
};

export const appendIncrementalPostfix = (str: `${string}${`_${number}` | ''}`) => {
  const currentPostfix = Number(str.split('_').pop());
  if (isNaN(currentPostfix)) {
    return `${str}_1`;
  }

  return `${str.slice(0, str.length - `_${currentPostfix}`.length)}_${currentPostfix + 1}`;
};

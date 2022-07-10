export const stringBuilder = (initial = "") => {
  const strings: string[] = [initial];

  return {
    build: () => strings.join(""),
    append(substring: string, newLine = false) {
      strings.push(`${newLine ? "\n" : ""}${substring}`);
      return this;
    },
    prepend(substring: string) {
      strings.unshift(substring);
      return this;
    },
  };
};

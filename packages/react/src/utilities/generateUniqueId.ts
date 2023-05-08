import { computeStackTrace } from "tracekit";
export const generateUniqueId = () => {
  const err = new Error();
  const stack = err.stack?.split("\n").slice(3).join("\n");
  if (!stack) {
    return JSON.stringify(computeStackTrace(err, 3).stack);
  }
  return stack;
};

export const applyTiming = <T>(cb: () => T) => {
  if (
    typeof process !== "undefined" &&
    typeof process["nextTick"] !== undefined
  ) {
    return process["nextTick"](cb);
  }
  if (typeof setImmediate !== "undefined") {
    return setImmediate(cb);
  }

  return setTimeout(cb, 0);
};

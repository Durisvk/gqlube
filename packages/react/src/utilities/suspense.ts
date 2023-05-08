export const wrapPromise = <T>(
  promise: Promise<T>
): {
  execute: () => T | Error;
} => {
  let status = "pending";
  let response: T | Error;

  const suspender = promise.then(
    (res) => {
      status = "success";
      response = res;
    },
    (err) => {
      status = "error";
      response = err;
    }
  );
  const execute = () => {
    switch (status) {
      case "pending": {
        throw suspender;
      }
      case "error":
        throw response;
      default: {
        return response;
      }
    }
  };

  return { execute };
};

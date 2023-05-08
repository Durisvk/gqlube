import { wrapPromise } from "../../src/utilities/suspense";

describe("unit | suspense", () => {
  it("should return execute function", () => {
    const promise = new Promise(() => {});
    const suspense = wrapPromise(promise);
    expect(suspense.execute).toBeInstanceOf(Function);
  });

  it("execute() should throw a promise while being resolved", () => {
    const promise = new Promise(() => {});
    const suspense = wrapPromise(promise);
    try {
      suspense.execute();
    } catch (e) {
      expect(e).toMatchObject(promise);
    }
  });

  it("execute() should return a value when resolved", async () => {
    const promise = new Promise((resolve) => resolve("value"));
    const suspense = wrapPromise(promise);
    await promise;
    try {
      expect(suspense.execute()).toBe("value");
    } catch (e) {
      fail(
        "execute() should not throw an error now that the promise was resolved"
      );
    }
  });

  it("execute() should throw an error when rejected", async () => {
    const promise = new Promise((resolve, reject) => reject("error"));
    const suspense = wrapPromise(promise);
    await promise.catch(() => {});
    try {
      suspense.execute();
      fail("execute() should throw an error now that the promise was rejected");
    } catch (e) {
      expect(e).toBe("error");
    }
  });
});

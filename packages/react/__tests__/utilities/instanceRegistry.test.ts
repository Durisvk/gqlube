import { instanceRegistry } from "../../src/utilities/instanceRegistry";

describe("unit | instanceRegistry", () => {
  const registry = instanceRegistry();

  it("should register new instance", () => {
    const instance = {};
    const id = "id";
    expect(registry.register(id, instance)).toBe(instance);
  });

  it("should return true if instance exists", () => {
    const id = "id";
    expect(registry.instanceExists(id)).toBe(true);
  });

  it("should return false if instance does not exist", () => {
    const id = "id2";
    expect(registry.instanceExists(id)).toBe(false);
  });

  it("should return instance", () => {
    const id = "id";
    expect(registry.getInstance(id)).toEqual({});
  });

  const execute = () => {};
  it("should register suspense", () => {
    const id = "id";

    expect(registry.registerSuspense(id, execute)).toBe(execute);
  });

  it("should return true if suspense exists", () => {
    const id = "id";
    expect(registry.suspenseExists(id)).toBe(true);
  });

  it("should return false if suspense does not exist", () => {
    const id = "id2";
    expect(registry.suspenseExists(id)).toBe(false);
  });

  it("should return suspense", () => {
    const id = "id";
    expect(registry.getSuspense(id)).toEqual({ execute });
  });
});

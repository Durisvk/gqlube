import { uniqueRegistry } from "../../../src/utilities/uniqueRegistry";

describe("unit | uniqueRegistry", () => {
  it("should work just like normal registry when there are no duplicates", () => {
    const registry = uniqueRegistry();

    expect(registry.addMany({ key1: "value1", key2: "value2" })).toEqual({});

    expect(registry.add("key3", "value3")).toBeUndefined();

    expect(registry.addMany({ key4: "value4", key5: "value5" })).toEqual({});

    expect(registry.getUniquelyNamedRecords()).toEqual({
      key1: "value1",
      key2: "value2",
      key3: "value3",
      key4: "value4",
      key5: "value5",
    });
  });

  it("should rename duplicate values by appending a deterministic numeric postfix", () => {
    const registry = uniqueRegistry();

    expect(registry.addMany({ key1: "value1", key2: "value2" })).toEqual({});

    expect(registry.add("key1", "value3")).toEqual("key1_1");

    expect(registry.addMany({ key2: "value4", key1: "value5" })).toEqual({
      key2: "key2_1",
      key1: "key1_2",
    });

    expect(registry.getUniquelyNamedRecords()).toEqual({
      key1: "value1",
      key2: "value2",
      key1_1: "value3",
      key2_1: "value4",
      key1_2: "value5",
    });
  });
});

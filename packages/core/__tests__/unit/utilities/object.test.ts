import {
  accessNestedField,
  applyAliasesToObject,
  isObject,
} from "../../../src/utilities/object";

describe("unit | object", () => {
  describe("appendIncrementalPostfix", () => {
    it.each([
      [
        { key1: "value", key2: true, key3: "hi" },
        { key2: "newKeyAlias" },
        { key1: "value", newKeyAlias: true, key3: "hi" },
      ],
      [
        { key1: "value", key2: true, key3: "hi" },
        {},
        { key1: "value", key2: true, key3: "hi" },
      ],
      [
        { key1: "value", key2: true, key3: "hi" },
        undefined,
        { key1: "value", key2: true, key3: "hi" },
      ],
      [
        { key1: "value", key2: true, key3: "hi" },
        { nonExistingKey: "here" },
        { key1: "value", key2: true, key3: "hi" },
      ],
      [
        { key1: "value", key2: true, key3: "hi" },
        { key1: "key2", key2: "key3", key3: "key1" },
        { key1: "hi", key2: "value", key3: true },
      ],
      [
        { key1: "value", key2: true, key3: "hi" },
        { key1: "newKey1", key2: "newKey2", key3: "newKey3" },
        { newKey1: "value", newKey2: true, newKey3: "hi" },
      ],
    ])(
      "should apply for an object %s aliases %s so that it turns into %s",
      (obj, aliases, expectedOutput) => {
        expect(applyAliasesToObject(obj as any, aliases)).toEqual(
          expectedOutput
        );
      }
    );
  });

  describe("accessNestedField", () => {
    it.each([
      [{ a: { b: { c: 1 } } }, ["a", "b"], "c", 1],
      [{}, ["a", "b"], "c", undefined],
      [{ a: { b: 1 } }, ["a", "c"], "d", undefined],
      [{ a: { b: { c: { d: 1 } } } }, ["b", "c"], "d", undefined],
    ])(
      "should access a nested field on object %s at path %s and field %s and return a value %s",
      (obj, path, field, expectedOutput) => {
        expect(accessNestedField(obj, path, field)).toEqual(expectedOutput);
      }
    );
  });

  describe("isObject", () => {
    it.each([
      [false, typeof "str", "str"],
      [false, typeof 11, 11],
      [false, typeof true, true],
      [true, typeof {}, {}],
      [true, typeof [], []],
    ])(
      "should return %s for type %s and value %s",
      (expectedOutput, _, val) => {
        expect(isObject(val)).toEqual(expectedOutput);
      }
    );
  });
});

import { restAndTail } from "../../../src/utilities/array";

describe("unit | array", () => {
  describe("restAndTail", () => {
    it.each([
      [[], [], undefined],
      [[1], [], 1],
      [[1, 2], [1], 2],
      [[1, 2, 3], [1, 2], 3],
    ])(
      "should get rest and tail from array %s as rest=%s and tail=%s",
      (arr, rest, tail) => {
        expect(restAndTail(arr)).toEqual(tail ? [rest, tail] : [rest]);
      }
    );
  });
});

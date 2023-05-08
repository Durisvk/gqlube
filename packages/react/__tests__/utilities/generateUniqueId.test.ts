import { generateUniqueId } from "../../src/utilities/generateUniqueId";
import { id1, id2 } from "./fixtures/generatedId";

describe("unit | generateUniqueId", () => {
  it("should return a string", () => {
    expect(typeof generateUniqueId()).toBe("string");
  });

  it("should generate unique id for different lines of code", () => {
    expect(id1).not.toEqual(id2);
  });

  it("should generate equal id for a single line of code", () => {
    expect(id1).toEqual(id1);
    expect(id2).toEqual(id2);
  });
});

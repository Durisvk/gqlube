import { isGQLubeQuery } from "../../src";
import { instance } from "../../src/instance";

describe("unit | isGQLubeQuery", () => {
  it("should return true for a query created with instance", () => {
    const [q] = instance({
      rootType: "Query",
      fetcher: () => Promise.resolve({}) as any,
    });
    expect(isGQLubeQuery(q)).toBeTruthy();
  });
});

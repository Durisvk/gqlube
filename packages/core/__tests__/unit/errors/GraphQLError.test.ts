import { GraphQLError } from "../../../src/errors/GraphQLError";

describe("unit | GraphQLError", () => {
  it("should map all errors to message", () => {
    const errors = [
      {
        message: "error 1",
      },
      {
        message: "error 2",
      },
    ];
    const error = new GraphQLError(errors as any[]);
    expect(error.message).toEqual(`error 1
error 2`);
  });

  it("should map an empty array of errors to empty message", () => {
    const errors: any[] = [];
    const error = new GraphQLError(errors);
    expect(error.message).toEqual("");
  });

  it("should accept empty parameters list", () => {
    const error = new GraphQLError();
    expect(error.message).toEqual("");
  });
});

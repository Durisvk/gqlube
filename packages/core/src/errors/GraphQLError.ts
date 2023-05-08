import { GraphQLResultError } from "../types";

export class GraphQLError extends Error {
  constructor(public readonly errors?: GraphQLResultError[]) {
    super(errors?.map(({ message }) => message).join("\n"));
  }
}

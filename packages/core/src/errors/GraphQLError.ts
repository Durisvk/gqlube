export class GraphQLError extends Error {
  constructor(errors: object[]) {
    super(JSON.stringify(errors));
  }
}

import { instance } from "./instance";

export { instance, QueryControls, InstanceOptions } from "./instance";
export { isGQLubeQuery } from "./isGQLubeQuery";
export {
  RootType,
  VariablesType,
  Fetcher,
  FetcherInput,
  GraphQLResult,
  GraphQLResultError,
} from "./types";
export { InitialQueryOptions } from "./query";
export { FetcherOptions, DefaultFetcherOptions } from "./fetcher";
export { SchedulerStatus, SchedulerOptions } from "./scheduler";
export { GraphQLError } from "./errors/GraphQLError";

export type Instance = ReturnType<typeof instance>;

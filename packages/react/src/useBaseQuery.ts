import {
  GraphQLResult,
  GraphQLResultError,
  InstanceOptions,
  instance,
} from "@gqlube/core";
import { useFetcher } from "./FetcherProvider";
import { useGQLube } from "./GQLubeProvider";
import { useUniqueId } from "./utilities/useUniqueId";
import { useUpdate } from "./utilities/useUpdate";
import { useMemo } from "react";

export type StatefulFetchingOutput = {
  loading: boolean;
  errors: Error | GraphQLResultError[] | null;
};

export const useBaseQuery = <
  TQuery extends object = object,
  TResult extends GraphQLResult = GraphQLResult
>(
  rootType: "Query" | "Mutation",
  options: Partial<
    Pick<InstanceOptions<TResult>, "fetcher" | "onError" | "operationName">
  > = {}
) => {
  const update = useUpdate();
  const { register, instanceExists, getInstance } = useGQLube();
  const fetcherOptions = useFetcher();
  const id = useUniqueId();

  // (source: https://stackoverflow.com/questions/50321419/typescript-returntype-of-generic-function)
  // It's not possible to obtain a ReturnType<typeof genericFunction<...>> with some generic parameters
  // Therefore the following hack is needed:
  const _hackTypescriptTypeofGenericFunction = (
    options: InstanceOptions<TResult>
  ) => instance<TQuery, TResult>(options);
  type _hackTypescriptReturnTypeTypeofGenericFunction = ReturnType<
    typeof _hackTypescriptTypeofGenericFunction
  >;

  if (!fetcherOptions && !options.fetcher) {
    throw new Error(
      "No fetcher provided. Did you forget to wrap your code under FetcherProvider?"
    );
  }

  if (!instanceExists(id)) {
    register(
      id,
      instance<TQuery, TResult>({
        ...options,
        rootType,
        fetcher: options.fetcher! ?? fetcherOptions,
      })
    );
  }

  const instanceRef = getInstance(
    id
  ) as _hackTypescriptReturnTypeTypeofGenericFunction;

  const [query, controls] = instanceRef;

  return [
    query,
    useMemo(
      () => ({
        ...controls,
        updateData: (
          innerUpdate: (data: TResult["data"]) => TResult["data"]
        ) => {
          const result = controls.updateData(innerUpdate);
          update();
          return result;
        },
      }),
      [controls]
    ),
    { id },
  ] as const;
};

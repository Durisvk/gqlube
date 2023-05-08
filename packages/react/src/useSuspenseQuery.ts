import { GraphQLResult, InstanceOptions } from "@gqlube/core";
import React, { useCallback } from "react";
import { useGQLube } from "./GQLubeProvider";
import { wrapPromise } from "./utilities/suspense";
import { useBaseQuery } from "./useBaseQuery";

export const useSuspenseQuery = <
  TQuery extends object = object,
  TResult extends GraphQLResult = GraphQLResult
>(
  options: Partial<
    Pick<InstanceOptions<TResult>, "fetcher" | "onError" | "operationName">
  > = {}
) => {
  const { registerSuspense, getSuspense } = useGQLube();

  const [query, controls, { id }] = useBaseQuery<TQuery, TResult>(
    "Query",
    options
  );

  const render = useCallback(
    (node: React.ReactNode) => {
      let execute = getSuspense(id)?.execute;
      if (!execute) {
        execute = registerSuspense(id, wrapPromise(controls.promise()).execute);
      }

      execute();
      return node;
    },
    [id]
  );

  return [render, query, controls];
};

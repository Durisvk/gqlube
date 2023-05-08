import {
  GraphQLResult,
  GraphQLResultError,
  InstanceOptions,
} from "@gqlube/core";
import { useCallback, useState, useEffect } from "react";
import { StatefulFetchingOutput, useBaseQuery } from "./useBaseQuery";

type Element = NonNullable<React.ReactNode | JSX.Element> | null;
export type UseQueryRenderOptions<
  TLoading extends Element,
  TError extends Element
> = {
  loadingFallback?: TLoading;
  errorFallback?: TError | ((error: Error | GraphQLResultError[]) => TError);
};

export const useQuery = <
  TQuery extends object = object,
  TResult extends GraphQLResult = GraphQLResult
>(
  options: Partial<
    Pick<InstanceOptions<TResult>, "fetcher" | "onError" | "operationName">
  > = {}
) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Error | GraphQLResultError[] | null>(
    null
  );

  const [query, controls] = useBaseQuery<TQuery, TResult>("Query", options);

  const render = useCallback(
    <TResult extends Element, TLoading extends Element, TError extends Element>(
      node: TResult,
      options: UseQueryRenderOptions<TLoading, TError> = {}
    ) => {
      if (loading) {
        return options.loadingFallback ?? null;
      }

      if (errors) {
        if (typeof options.errorFallback === "function") {
          return options.errorFallback(errors);
        }

        return options.errorFallback ?? null;
      }

      return node;
    },
    [loading, errors]
  );

  useEffect(() => {
    setLoading(true);
    setErrors(null);
    controls
      .promise()
      .then((r) => {
        setLoading(false);
        setErrors(r?.errors ?? null);
      })
      .catch((e) => {
        setLoading(false);
        setErrors(e);
      });
  }, [controls]);

  return [
    render,
    query,
    controls,
    { loading, errors } as StatefulFetchingOutput,
  ] as const;
};

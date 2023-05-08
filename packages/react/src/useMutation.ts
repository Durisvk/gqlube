import {
  GraphQLResult,
  GraphQLResultError,
  InstanceOptions,
} from "@gqlube/core";
import { useCallback, useState } from "react";
import { useBaseQuery, StatefulFetchingOutput } from "./useBaseQuery";

export const useMutation = <
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

  const [query, controls] = useBaseQuery<TQuery, TResult>("Mutation", options);

  const execute = useCallback(
    async <T>(callback: (m: TQuery) => Promise<T> | T) => {
      setLoading(true);
      setErrors(null);

      try {
        const possiblePromise = callback(query);
        if (possiblePromise instanceof Promise) {
          await possiblePromise;
        }
        const result = await controls.promise();
        setLoading(false);
        return result;
      } catch (error) {
        setLoading(false);
        setErrors(error as Error | GraphQLResultError[]);
      }
    },
    [setLoading, setErrors, controls, query]
  );

  return [execute, { loading, errors } as StatefulFetchingOutput] as const;
};

import type { GraphQLResult, Fetcher, FetcherInput, VariablesType } from './types';

export type DefaultFetcherOptions = Omit<RequestInit, 'body'> & { url: string };

export const defaultFetcher = <TVariables extends VariablesType, TResult extends GraphQLResult>({
  url,
  ...options
}: DefaultFetcherOptions): Fetcher<TVariables, TResult> => {
  return async (input: FetcherInput<TVariables>) => {
    const res = await fetch(url, {
      ...options,
      body: JSON.stringify({
        operationName: input.operationName,
        query: input.query,
        variables: input.variables,
      }),
    });

    const result: TResult = await res.json();
    return result;
  };
};

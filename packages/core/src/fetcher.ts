import fetch from 'cross-fetch';
import type { GraphQLResult, Fetcher, FetcherInput, VariablesType } from './types';

export type DefaultFetcherOptions = Omit<RequestInit, 'body'> & { url: string };
export type FetcherOptions<
  TResult extends GraphQLResult<object> = GraphQLResult<object>,
  TVariables extends VariablesType = VariablesType,
> = Fetcher<TResult, TVariables> | DefaultFetcherOptions;

export const defaultFetcher = <TVariables extends VariablesType, TResult extends GraphQLResult>({
  url,
  ...options
}: DefaultFetcherOptions): Fetcher<TResult, TVariables> => {
  return async (input: FetcherInput<TVariables>) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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

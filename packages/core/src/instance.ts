import { deepProxy } from './deepProxy';
import { defaultFetcher, FetcherOptions } from './fetcher';
import { generator } from './generator';
import { interceptor } from './interceptor';
import { query, InitialQueryOptions } from './query';
import { scheduler, SchedulerStatus } from './scheduler';
import { GraphQLResult } from './types';
import { GraphQLError } from './errors/GraphQLError';

type UnknownInterceptorArgs = unknown[];

export type Options<TResult extends GraphQLResult = GraphQLResult> = InitialQueryOptions & {
  onError?: (error: GraphQLError) => unknown;
  fetcher: FetcherOptions<TResult>;
};

export type QueryControls<TResult extends GraphQLResult = GraphQLResult> = {
  refetch: () => void;
  status: () => SchedulerStatus;
  promise: () => Promise<TResult | undefined>;
};

export const instance = <TQuery extends object, TResult extends GraphQLResult = GraphQLResult>(
  options: Options<TResult>,
): [TQuery, QueryControls] => {
  const q = query(options);
  const i = interceptor<TResult['data']>(q);
  const p = deepProxy<UnknownInterceptorArgs, TQuery>(i.intercept);
  const g = generator(q);
  const f =
    typeof options.fetcher === 'function'
      ? options.fetcher
      : defaultFetcher<TResult>(options.fetcher);

  const s = scheduler<TResult>(g, f, (result) => {
    if (result.errors) {
      const error = new GraphQLError(result.errors);
      s.setStatus('ERROR');
      if (options.onError) return options.onError(error);
      else throw error;
    }

    i.storeData(result.data);
  });

  return [
    p,
    {
      refetch: s.refetch,
      status: s.getStatus,
      promise: s.promise,
    },
  ];
};

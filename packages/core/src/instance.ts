import { deepProxy } from './deepProxy';
import { defaultFetcher, FetcherOptions } from './fetcher';
import { generator } from './generator';
import { interceptor } from './interceptor';
import { query, InitialQueryOptions } from './query';
import { scheduler, SchedulerStatus } from './scheduler';
import { GraphQLResult } from './types';
import { GraphQLError } from './errors/GraphQLError';

type UnknownInterceptorArgs = unknown[];

export type Options = InitialQueryOptions & {
  fetcher: FetcherOptions;
};

export type QueryControls = {
  refetch: () => void;
  status: () => SchedulerStatus;
  promise: () => Promise<GraphQLResult | undefined>;
};

export const instance = <TQuery extends object, TResult extends GraphQLResult>(
  options: Options,
): [TQuery, QueryControls] => {
  const q = query(options);
  const i = interceptor(q);
  const p = deepProxy<UnknownInterceptorArgs, TQuery>(i.intercept);
  const g = generator(q);
  const f =
    typeof options.fetcher === 'function' ? options.fetcher : defaultFetcher(options.fetcher);

  const s = scheduler(g, f, (result) => {
    if (result.errors) throw new GraphQLError(result.errors);
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

import { Generator } from './generator';
import { Fetcher, GraphQLResult } from './types';

const INTERNALS = Symbol('Internal information for scheduler');

export type SchedulerStatus = 'HARVESTING' | 'FETCHING' | 'DONE' | 'REFETCHING';
type SchedulerFetchingStatus = Extract<SchedulerStatus, 'FETCHING' | 'REFETCHING'>;

export const scheduler = <TResult extends GraphQLResult>(
  generator: Generator,
  fetcher: Fetcher<TResult>,
  onFetched?: (result: TResult) => void,
) => {
  const internals: Partial<{
    waitForEmptyStackPromise: Promise<void>;
    fetchingPromise: Promise<TResult>;
  }> & { status: SchedulerStatus } = { status: 'HARVESTING' };

  const createEmptyStackPromise = () =>
    new Promise<void>((resolve, reject) => {
      if (generator.isReady()) {
        return resolve();
      }
      createEmptyStackPromise().then(resolve).catch(reject);
    });

  const scheduleFetching = (status: SchedulerFetchingStatus) => {
    internals.waitForEmptyStackPromise = createEmptyStackPromise();

    // tslint:disable-next-line: no-floating-promises
    internals.waitForEmptyStackPromise.then(() => {
      delete internals.waitForEmptyStackPromise;
      internals.status = status;

      internals.fetchingPromise = new Promise((resolve, reject) => {
        fetcher({
          operationName: generator.produceOperationName(),
          query: generator.produceQuery() as string,
          variables: generator.produceVariables(),
        })
          .then(resolve)
          .catch(reject);
      });

      // tslint:disable-next-line: no-floating-promises
      internals.fetchingPromise.then((result) => {
        delete internals.fetchingPromise;
        internals.status = 'DONE';
        onFetched?.(result);
      });
    });
  };

  scheduleFetching('FETCHING');

  return {
    [INTERNALS]: internals,
    refetch: () => {
      scheduleFetching('REFETCHING');
    },

    getStatus: () => internals.status,
    promise: async () => {
      await internals.waitForEmptyStackPromise;
      return internals.fetchingPromise;
    },
  };
};

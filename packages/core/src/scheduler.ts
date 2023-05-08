import { Generator } from "./generator";
import { Fetcher, GraphQLResult } from "./types";
import { applyTiming } from "./utilities/timing";

const INTERNALS = Symbol("Internal information for scheduler");
export type SchedulerStatus =
  | "HARVESTING"
  | "FETCHING"
  | "DONE"
  | "ERROR"
  | "REFETCHING";

export type SchedulerOptions = {
  lazy?: boolean;
};

type SchedulerFetchingStatus = Extract<
  SchedulerStatus,
  "FETCHING" | "REFETCHING"
>;

export const scheduler = <TResult extends GraphQLResult>(
  generator: Generator,
  fetcher: Fetcher<TResult>,
  options?: SchedulerOptions & { onFetched?: (result: TResult) => void }
) => {
  const { onFetched, lazy = true } = options || {};

  const internals: Partial<{
    waitForEmptyStackPromise: Promise<void>;
    fetchingPromise: Promise<TResult>;
  }> & { status: SchedulerStatus } = {
    status: "HARVESTING",
  };

  const createEmptyStackPromise = (i = 0) =>
    new Promise<void>((resolve, reject) => {
      if (generator.isReady()) {
        return resolve();
      }

      applyTiming(() => createEmptyStackPromise(i).then(resolve).catch(reject));
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
      internals.fetchingPromise
        .then((result) => {
          delete internals.fetchingPromise;
          internals.status = "DONE";
          onFetched?.(result);
        })
        .catch((e) => {
          delete internals.fetchingPromise;
          internals.status = "ERROR";
          onFetched?.({ errors: [e] } as TResult);
        });
    });
  };

  if (!lazy) {
    scheduleFetching("FETCHING");
  }

  const promise = async () => {
    await internals.waitForEmptyStackPromise;
    return internals.fetchingPromise;
  };

  return {
    [INTERNALS]: internals,
    refetch: () => {
      internals.status = "REFETCHING";
      scheduleFetching("REFETCHING");
      return promise();
    },
    setStatus: (status: "ERROR") => (internals.status = status),
    getStatus: () => internals.status,
    promise: () => {
      if (lazy) scheduleFetching("FETCHING");
      return promise();
    },
  };
};

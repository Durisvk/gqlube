import { scheduler } from "../../src/scheduler";

describe("unit | scheduler", () => {
  it("should handle a scheduling lifecycle", async () => {
    const generator = {
      produceOperationName: jest.fn(() => "operationName"),
      produceQuery: jest.fn(() => "query"),
      produceVariables: jest.fn(() => ({
        variable1: "value1",
        variable2: "value2",
      })),
      isReady: jest.fn(() => true),
    };

    const fetcher = jest.fn(() =>
      Promise.resolve({ data: { resolved: "value" }, errors: [] })
    );

    const onFetched = jest.fn();

    const { getStatus, promise, refetch } = scheduler(
      generator,
      fetcher,
      onFetched
    );

    expect(getStatus()).toBe("HARVESTING");
    expect(generator.produceQuery).toHaveBeenCalledTimes(0);
    expect(fetcher).toHaveBeenCalledTimes(0);

    const promiseResult = await promise();

    expect(getStatus()).toBe("DONE");

    expect(generator.produceQuery).toHaveBeenCalledTimes(1);

    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher).toHaveBeenCalledWith({
      operationName: "operationName",
      query: "query",
      variables: {
        variable1: "value1",
        variable2: "value2",
      },
    });

    expect(promiseResult).toEqual({ data: { resolved: "value" }, errors: [] });

    expect(onFetched).toHaveBeenCalledTimes(1);
    expect(onFetched).toHaveBeenCalledWith({
      data: { resolved: "value" },
      errors: [],
    });

    const refetchingPromise = refetch();

    expect(getStatus()).toBe("REFETCHING");

    const refetchingPromiseResult = await refetchingPromise;
    expect(getStatus()).toBe("DONE");

    expect(refetchingPromiseResult).toEqual({
      data: { resolved: "value" },
      errors: [],
    });
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(fetcher).toHaveBeenLastCalledWith({
      operationName: "operationName",
      query: "query",
      variables: {
        variable1: "value1",
        variable2: "value2",
      },
    });
  });
});

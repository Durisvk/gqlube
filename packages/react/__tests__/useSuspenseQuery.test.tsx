/**
 * @jest-environment jsdom
 */
import React, { Suspense } from "react";
import {
  RenderResult,
  cleanup,
  act,
  render,
  waitFor,
} from "@testing-library/react";
import { useSuspenseQuery } from "../src";
import "@testing-library/jest-dom";

describe("unit | useSuspenseQuery", () => {
  afterEach(cleanup);

  class ErrorBoundary extends React.Component<React.PropsWithChildren> {
    state: { error?: string } = {};
    public static getDerivedStateFromError(error: Error) {
      return { error };
    }

    public render() {
      if (this.state.error) {
        return this.state.error;
      }

      return this.props.children;
    }
  }

  const performSimpleQuery = async (fetcher: () => Promise<any>) => {
    const fetcherMock = jest.fn(fetcher);
    let promise: () => Promise<any> = () => Promise.resolve();
    const Component: React.FC = () => {
      const [r, q, { promise: p }] = useSuspenseQuery<any>({
        fetcher: fetcherMock,
      });

      promise = p;

      return r(<div>{q.a.b.c}</div>);
    };

    let renderResult: RenderResult | undefined = undefined;

    await act(() => {
      renderResult = render(
        <ErrorBoundary>
          <Suspense fallback={<div>loading</div>}>
            <Component />
          </Suspense>
        </ErrorBoundary>
      );
    });

    const { getByText } = renderResult!;
    await waitFor(() => {
      expect(getByText("loading")).toBeInTheDocument();
    });
    expect(fetcherMock).toBeCalledTimes(1);

    return { getByText, promise: () => act(promise), fetcherMock };
  };

  it("should render a component with useSuspenseQuery", async () => {
    const { getByText, promise } = await performSimpleQuery(
      () =>
        new Promise<any>((resolve) => {
          setTimeout(() => {
            resolve({ data: { a: { b: { c: 3 } } } });
          }, 200);
        })
    );

    await promise();

    await waitFor(() => {
      expect(getByText("3")).toBeInTheDocument();
    });
  });
});

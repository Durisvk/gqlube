/**
 * @jest-environment jsdom
 */
import React from "react";
import { useQuery } from "../src/useQuery";
import {
  act,
  cleanup,
  render,
  RenderResult,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";

describe("unit | useQuery", () => {
  afterEach(cleanup);

  const performSimpleQuery = async (fetcher: () => Promise<any>) => {
    const fetcherMock = jest.fn(fetcher);
    let promise: () => Promise<any> = () => Promise.resolve();
    const Component: React.FC = () => {
      const [r, q, { promise: p }] = useQuery<any>({
        fetcher: fetcherMock,
      });

      promise = p;

      return r(<div>{q.a.b.c}</div>, {
        loadingFallback: <div>loading</div>,
        errorFallback: <div>error</div>,
      });
    };

    let renderResult: RenderResult | undefined = undefined;
    await act(() => {
      renderResult = render(<Component />);
    });

    const { getByText } = renderResult!;
    await waitFor(() => {
      expect(getByText("loading")).toBeInTheDocument();
    });
    expect(fetcherMock).toBeCalledTimes(1);

    return { getByText, promise: () => act(promise), fetcherMock };
  };

  it("should render a component with useQuery", async () => {
    const { getByText, promise } = await performSimpleQuery(
      () =>
        new Promise<any>((resolve) => {
          setTimeout(() => {
            resolve({ data: { a: { b: { c: 3 } } } });
          }, 200);
        })
    );

    await promise();

    expect(getByText("3")).toBeInTheDocument();
  });

  it("should render a component with useQuery when promise resolves in graphql error", async () => {
    const { promise, getByText } = await performSimpleQuery(
      () =>
        new Promise<any>((resolve) => {
          setTimeout(() => {
            resolve({ errors: [{ message: "error" }] });
          }, 200);
        })
    );

    try {
      await promise();
    } catch (e) {}

    await waitFor(() => {
      expect(getByText("error")).toBeInTheDocument();
    });
  });
});

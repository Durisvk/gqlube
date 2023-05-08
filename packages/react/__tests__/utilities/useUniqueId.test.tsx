/**
 * @jest-environment jsdom
 */
import { useUniqueId } from "../../src/utilities/useUniqueId";
import { renderHook } from "@testing-library/react";

describe("unit | useUniqueId", () => {
  // should return same string on each rerender
  it("should return same string on each rerender", () => {
    // use real react rendering to test hook
    const { result, rerender } = renderHook(() => useUniqueId());
    const first = result.current;
    rerender();
    const second = result.current;

    expect(first).toBe(second);
  });
});

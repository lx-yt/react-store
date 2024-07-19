import { describe, test, expect } from "vitest";

import { act, renderHook, waitFor } from "@testing-library/react";

import { createStore, useStore } from "./useStore";

import type { Store } from "./useStore";

describe("createStore", () => {
  test("should have a subscribe and getSnapshot", () => {
    const store = createStore(0);

    expect(store.subscribe).toBeDefined();
    expect(store.getSnapshot).toBeDefined();
  });
});

describe("useStore", () => {
  test("should update value when it changes internally", () => {
    const store = createStore(0);
    const { result } = renderHook(() => useStore(store));

    expect(result.current[0]).toBe(0);

    act(() => {
      result.current[1](1);
    });

    expect(result.current[0]).toBe(1);
  });

  test("should update value when it changes externally", async () => {
    const store = createStore(0);
    const { result } = renderHook(() => useStore(store));

    expect(result.current[0]).toBe(0);

    store.setValue(1);
    expect(store.getSnapshot()).toBe(1);
    expect(result.current[0]).toBe(0);
    await waitFor(
      () => {
        expect(result.current[0]).toBe(1);
      },
      { timeout: 1000 }
    );
  });

  test("should update value when it changes in other component", () => {
    const store = createStore(0);
    const { result } = renderHook(() => useStore(store));
    const { result: result2 } = renderHook(() => useStore(store));

    expect(result.current[0]).toBe(0);
    expect(result2.current[0]).toBe(0);

    act(() => {
      result.current[1](1);
    });

    expect(result.current[0]).toBe(1);
    expect(result2.current[0]).toBe(1);
  });

  test("should switch stores when a different one is passed in", () => {
    const store = createStore(0);
    const store2 = createStore(1);

    const { result, rerender } = renderHook(
      (storeParam: Store<number>) => useStore(storeParam),
      {
        initialProps: store,
      }
    );

    expect(result.current[0]).toBe(0);

    rerender(store2);

    expect(result.current[0]).toBe(1);

    expect(store.getSnapshot()).toBe(0);
    expect(store2.getSnapshot()).toBe(1);
  });
});

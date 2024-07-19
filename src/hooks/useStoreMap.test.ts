import { describe, test, expect } from "vitest";

import { act, renderHook } from "@testing-library/react";

import { createStoreMap, useStoreMap } from "./useStoreMap";
import { createStore } from "./useStore";

import type { StoreMap } from "./useStoreMap";

describe("createStoreMap", () => {
  test("should return an empty map", () => {
    const storeMap = createStoreMap();
    expect(storeMap).toEqual(new Map());
  });

  test("should return a map with initial stores", () => {
    const store1 = createStore(1);
    const store2 = createStore(2);

    const storeMap = createStoreMap([
      ["a", store1],
      ["b", store2],
    ]);
    expect(storeMap).toEqual(
      new Map([
        ["a", store1],
        ["b", store2],
      ])
    );
  });
});

describe("useStoreMap", () => {
  test("should return the initial value", () => {
    const storeMap = createStoreMap();
    const { result } = renderHook(() => useStoreMap(storeMap, "a", 2));
    expect(result.current[0]).toEqual(2);
  });

  test("should update the value", () => {
    const storeMap = createStoreMap();
    const { result } = renderHook(() => useStoreMap(storeMap, "a", 2));

    expect(result.current[0]).toEqual(2);

    act(() => {
      result.current[1](3);
    });

    expect(result.current[0]).toEqual(3);
  });

  test("should update the value in other components", () => {
    const storeMap = createStoreMap();
    const { result } = renderHook(() => useStoreMap(storeMap, "a", 2));
    const { result: result2 } = renderHook(() => useStoreMap(storeMap, "a", 2));

    expect(result.current[0]).toEqual(2);
    expect(result2.current[0]).toEqual(2);

    act(() => {
      result.current[1](3);
    });

    expect(result.current[0]).toEqual(3);
    expect(result2.current[0]).toEqual(3);
  });

  test("should ignore initialValue on subsequent calls, whether rerenders or in other components", () => {
    const storeMap = createStoreMap();
    const { result } = renderHook(() => useStoreMap(storeMap, "a", 2));
    const { result: result2 } = renderHook(() => useStoreMap(storeMap, "a", 3));

    expect(result.current[0]).toEqual(2);
    expect(result2.current[0]).toEqual(2);
  });

  test("should keep track of multiple stores", () => {
    const storeMap = createStoreMap();
    const { result } = renderHook(() => useStoreMap(storeMap, "a", 2));
    const { result: result2 } = renderHook(() => useStoreMap(storeMap, "b", 3));
    const { result: result3 } = renderHook(() => useStoreMap(storeMap, "c", 4));

    expect(result.current[0]).toEqual(2);
    expect(result2.current[0]).toEqual(3);
    expect(result3.current[0]).toEqual(4);

    act(() => {
      result.current[1](5);
      result2.current[1](6);
      result3.current[1](7);
    });

    expect(result.current[0]).toEqual(5);
    expect(result2.current[0]).toEqual(6);
    expect(result3.current[0]).toEqual(7);
  });

  test("should not create more entries than the number of distinct keys used to call it", () => {
    const storeMap = createStoreMap();
    const { result } = renderHook(() => useStoreMap(storeMap, "a", 2));
    const { result: result2 } = renderHook(() => useStoreMap(storeMap, "b", 3));
    const { result: result3 } = renderHook(() => useStoreMap(storeMap, "c", 4));

    expect(result.current[0]).toEqual(2);
    expect(result2.current[0]).toEqual(3);
    expect(result3.current[0]).toEqual(4);

    expect(storeMap.size).toEqual(3);
  });

  test("should not create more entries when the same key is called multiple times", () => {
    const storeMap = createStoreMap();
    const { result } = renderHook(() => useStoreMap(storeMap, "a", 2));
    const { result: result2 } = renderHook(() => useStoreMap(storeMap, "a", 3));
    const { result: result3 } = renderHook(() => useStoreMap(storeMap, "a", 4));

    expect(result.current[0]).toEqual(2);
    expect(result2.current[0]).toEqual(2);
    expect(result3.current[0]).toEqual(2);

    expect(storeMap.size).toEqual(1);
  });

  test("should change the storeMap when a different one is passed into the hook in subsequent calls", () => {
    const storeMap = createStoreMap([["a", createStore("test1")]]);
    const storeMap2 = createStoreMap([["a", createStore("test2")]]);

    const { result, rerender } = renderHook(
      (storeMapParam: StoreMap<string>) =>
        useStoreMap(storeMapParam, "a", "test3"),
      {
        initialProps: storeMap,
      }
    );

    expect(result.current[0]).toEqual("test1");

    rerender(storeMap2);

    expect(result.current[0]).toEqual("test2");

    expect(storeMap.get("a")?.getSnapshot()).toEqual("test1");
    expect(storeMap2.get("a")?.getSnapshot()).toEqual("test2");
  });

  test("should change the store when a different key is passed into the hook in subsequent calls", () => {
    const storeMap = createStoreMap();

    const { result, rerender } = renderHook(
      (props: { key: string; initialValue: unknown }) =>
        useStoreMap(storeMap, props.key, props.initialValue),
      {
        initialProps: { key: "a", initialValue: "test1" },
      }
    );

    expect(result.current[0]).toEqual("test1");

    rerender({ key: "b", initialValue: "test2" });

    expect(result.current[0]).toEqual("test2");

    expect(storeMap.get("a")?.getSnapshot()).toEqual("test1");
    expect(storeMap.get("b")?.getSnapshot()).toEqual("test2");
  });
});

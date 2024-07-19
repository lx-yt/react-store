import { createStore, useStore } from "./useStore";

import type { Store } from "./useStore";

export type StoreMap<T> = Map<string, Store<T>>;

export function createStoreMap<T>(
  initialStores?: ConstructorParameters<typeof Map<string, Store<T>>>[0]
): StoreMap<T> {
  return new Map(initialStores);
}

export function useStoreMap<T>(
  storeMap: ReturnType<typeof createStoreMap<T>>,
  key: string,
  initialValue: Parameters<typeof createStore<T>>[0]
): ReturnType<typeof useStore<T>> {
  const store =
    storeMap.get(key) ??
    (() => {
      const s = createStore<T>(initialValue);
      storeMap.set(key, s);
      return s;
    })();

  const state = useStore(store);
  return state;
}

import type { Store } from "./useStore";

export type StoreMap<T> = Map<string, Store<T>>;

export function createStoreMap<T>(
  initialStores?: ConstructorParameters<typeof Map<string, Store<T>>>[0]
): StoreMap<T> {
  return new Map(initialStores);
}


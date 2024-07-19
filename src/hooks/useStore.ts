import React from "react";

export type Listener = () => void;

type Factory<T> = () => T;
type Deriver<T> = (value: T) => T;

type ValueOrFactory<T> = T | Factory<T>;
type ValueOrDeriver<T> = T | Deriver<T>;

type SetterOrUpdater<T> = (value: ValueOrDeriver<T>) => void;

export interface Store<T> {
  subscribe: (listener: Listener) => () => void;
  getSnapshot: () => T;
  setValue: SetterOrUpdater<T>;
}

function isFactory<T>(value: ValueOrFactory<T>): value is Factory<T> {
  return typeof value === "function";
}

function isDeriver<T>(value: ValueOrDeriver<T>): value is Deriver<T> {
  return typeof value === "function";
}

export function createStore<T>(initialValue: ValueOrFactory<T>): Store<T> {
  if (isFactory(initialValue)) {
    initialValue = initialValue();
  }
  let value = initialValue;

  const listeners = new Set<Listener>();

  const subscribe = (listener: Listener) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  const emit = () => {
    listeners.forEach((listener) => {
      listener();
    });
  };

  const getSnapshot = () => value;

  const setValue = (newValue: ValueOrDeriver<T>) => {
    if (isDeriver(newValue)) {
      newValue = newValue(value);
    }

    if (Object.is(value, newValue)) {
      return;
    }

    value = newValue;
    emit();
  };

  return {
    getSnapshot,
    subscribe,
    setValue,
  };
}

export function useStore<T>(store: Store<T>): [T, SetterOrUpdater<T>] {
  const value = React.useSyncExternalStore(store.subscribe, store.getSnapshot);

  return React.useMemo(() => [value, store.setValue], [value, store.setValue]);
}

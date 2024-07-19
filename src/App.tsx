import React from "react";

import { createStore, useStore } from "./hooks/useStore";
import { createStoreMap, useStoreMap } from "./hooks/useStoreMap";

const storeA = createStore("a");
const storeB = createStore("b");

const storeMapA = createStoreMap<string>();

function App() {
  return (
    <>
      <h1>Example: React Store</h1>
      <p>
        Component 1 (violet) renders whenever the values A (green) or B (red)
        change.
      </p>
      <p>
        Compoennt 2 (yellow) renders whenever the values B (red) or C (blue)
        change.
      </p>
      <p>
        Component 3 (slate) renders whenever the values C (blue) or A (green)
        change.
      </p>
      <DistantAB />
      <DistantBC />
      <DistantCA />
      <p>
        (Note) The shared parent of these components does not pass any state
        into them.
      </p>
    </>
  );
}

function DistantAB() {
  const [valueA, setValueA] = useStore(storeA);
  const [valueB, setValueB] = useStore(storeB);

  const changeValueA = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValueA(event.target.value);
    },
    [setValueA]
  );

  const changeValueB = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValueB(event.target.value);
    },
    [setValueB]
  );

  return (
    <div className="m-2 p-2 border rounded bg-violet-200">
      1.
      <div>
        <label>
          A:
          <input
            value={valueA}
            onChange={changeValueA}
            className="m-2 p-2 border border-black rounded bg-green-200"
          />
        </label>
        <label>
          B:
          <input
            value={valueB}
            onChange={changeValueB}
            className="m-2 p-2 border border-black rounded bg-red-200"
          />
        </label>
      </div>
    </div>
  );
}

function DistantBC() {
  const [valueB, setValueB] = useStore(storeB);
  const [valueC, setValueC] = useStoreMap(storeMapA, "c", "c");

  const changeValueB = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValueB(event.target.value);
    },
    [setValueB]
  );

  const changeValueC = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValueC(event.target.value);
    },
    [setValueC]
  );

  return (
    <div className="m-2 p-2 border rounded bg-yellow-200">
      2.
      <div>
        <label>
          B:
          <input
            value={valueB}
            onChange={changeValueB}
            className="m-2 p-2 border border-black rounded bg-red-200"
          />
        </label>
        <label>
          C:
          <input
            value={valueC}
            onChange={changeValueC}
            className="m-2 p-2 border border-black rounded bg-blue-200"
          />
        </label>
      </div>
    </div>
  );
}

function DistantCA() {
  const [valueC, setValueC] = useStoreMap(storeMapA, "c", "c");
  const [valueA, setValueA] = useStore(storeA);

  const changeValueC = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValueC(event.target.value);
    },
    [setValueC]
  );

  const changeValueA = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValueA(event.target.value);
    },
    [setValueA]
  );

  return (
    <div className="m-2 p-2 border rounded bg-slate-200">
      3.
      <div>
        <label>
          C:
          <input
            value={valueC}
            onChange={changeValueC}
            className="m-2 p-2 border border-black rounded bg-blue-200"
          />
        </label>
        <label>
          A:
          <input
            value={valueA}
            onChange={changeValueA}
            className="m-2 p-2 border border-black rounded bg-green-200"
          />
        </label>
      </div>
    </div>
  );
}

export default App;

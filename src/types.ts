declare module 'valtio' {
  function useSnapshot<T extends object>(p: T): T;
}

export type Cell = [0 | 1, -1 | 0 | 1];
export type Hint = [number, 0 | 1];
export type Coord = [number, number];

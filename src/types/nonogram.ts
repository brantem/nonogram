export enum CellStatus {
  Empty,
  Filled,
  Marked,
}

export type Cell = [0 | 1] | [0 | 1, CellStatus];

export enum CellStatus {
  Empty,
  Filled,
  Marked,
}

export type Cell = [0 | 1] | [0 | 1, CellStatus];

type BaseHistory = [number, number];
export type AutoFillHistory = BaseHistory;
export type History = BaseHistory | [...BaseHistory, AutoFillHistory[]];

export type Hint = ([number] | [number, 1])[];

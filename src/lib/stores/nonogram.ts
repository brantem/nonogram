import { create } from 'zustand';

import { type Cell, CellStatus, type AutoFillHistory, type History, type Hint } from 'types';

type Direction = 'row' | 'column';

type NonogramState = {
  rows: number;
  columns: number;

  grid: Cell[][];
  histories: History[];

  isDragging: Boolean;
  startDragging: () => void;
  stopDragging: () => void;

  setup: (rows: number, columns: number) => void;
  generate: () => void;
  paintCell: (row: number, column: number) => void;
  paintCellByElement: (el: Element) => void;
  undo: () => void;
  generateHints: (direction: Direction) => Hint[];

  _autoFill: (row: number, column: number) => void;
  _isLineCorrect: (direction: Direction, index: number) => boolean;
};

const isCorrect = (cell: Cell) => cell[0] === 0 || (cell[0] === 1 && cell[1] === CellStatus.Filled);

export const useNonogramStore = create<NonogramState>()((set, get) => ({
  rows: 5,
  columns: 5,

  grid: [],
  histories: [],

  isDragging: false,
  startDragging: () => set({ isDragging: true }),
  stopDragging: () => set({ isDragging: false }),

  setup: (rows, columns) => {
    const { generate } = get();
    set({ rows, columns });
    generate();
  },
  generate: () => {
    const { rows, columns, _autoFill } = get();

    let grid = new Array(rows);
    for (let i = 0; i < rows; i++) {
      grid[i] = new Array(columns);
      for (let j = 0; j < columns; j++) {
        grid[i][j] = [Math.random() < 0.5 ? 0 : 1];
      }
    }
    set({ grid, histories: [] });

    for (let i = 0; i < rows; i++) _autoFill(i, 0);
    for (let i = 0; i < columns; i++) _autoFill(0, i);
  },
  paintCell: (row, column) => {
    const { grid, histories, generate, _autoFill } = get();
    if (!!grid[row][column][1]) return;

    set({ histories: [...histories, [row, column]] });
    grid[row][column][1] = CellStatus.Filled;
    _autoFill(row, column);

    if (grid.every((row) => row.every(isCorrect))) setTimeout(generate, 500);
  },
  paintCellByElement: (el) => {
    const { paintCell } = get();

    const _row = parseInt(el.getAttribute('data-row') as string);
    const _column = parseInt(el.getAttribute('data-column') as string);
    paintCell(_row, _column);
  },
  undo: () => {
    const { grid, histories } = get();
    if (!histories.length) return false;

    const [row, column, _histories] = histories.slice(-1)[0];
    grid[row][column] = [grid[row][column][0]];

    if (_histories) {
      for (let i = 0; i < _histories.length; i++) {
        grid[_histories[i][0]][_histories[i][1]] = [grid[_histories[i][0]][_histories[i][1]][0]];
      }
    }

    set({ grid, histories: histories.slice(0, -1) });
  },
  generateHints: (direction) => {
    const { rows, columns, grid } = get();
    if (!grid.length) return [];

    let hints = [];
    switch (direction) {
      case 'row':
        for (let i = 0; i < rows; i++) {
          const hint: Hint = [];
          let line = 0;
          let correct = 0;
          for (let j = 0; j < columns; j++) {
            if (grid[i][j][1] === CellStatus.Filled) correct += grid[i][j][0];
            if (grid[i][j][0] === 0) {
              if (line > 0) hint.push(correct === line ? [line, 1] : [line]);
              line = 0;
              correct = 0;
              continue;
            }
            line += grid[i][j][0];
          }
          if (line > 0) hint.push(correct === line ? [line, 1] : [line]);
          hints.push(hint);
        }
        break;
      case 'column':
        for (let i = 0; i < columns; i++) {
          const hint: Hint = [];
          let line = 0;
          let correct = 0;
          for (let j = 0; j < rows; j++) {
            if (grid[j][i][1] === CellStatus.Filled) correct += grid[j][i][0];
            if (grid[j][i][0] === 0) {
              if (line > 0) hint.push(correct === line ? [line, 1] : [line]);
              line = 0;
              correct = 0;
              continue;
            }
            line += grid[j][i][0];
          }
          if (line > 0) hint.push(correct === line ? [line, 1] : [line]);
          hints.push(hint);
        }
        break;
    }

    return hints;
  },

  _autoFill: (row, column) => {
    const { rows, columns, grid, histories, _isLineCorrect } = get();

    let _histories: AutoFillHistory[] = [];
    if (_isLineCorrect('row', row)) {
      for (let i = 0; i < columns; i++) {
        if (grid[row][i].length === 2) continue;
        grid[row][i][1] = CellStatus.Marked;
        _histories.push([row, i]);
      }
    }

    if (_isLineCorrect('column', column)) {
      for (let i = 0; i < rows; i++) {
        if (grid[i][column].length === 2) continue;
        grid[i][column][1] = CellStatus.Marked;
        _histories.push([i, column]);
      }
    }

    if (histories.length && _histories.length) {
      let history = histories[histories.length - 1];
      if (history.length === 2) {
        history = [...history, _histories];
      } else {
        history[2].concat(_histories);
      }

      set({ grid, histories: [...histories.slice(0, -1), history] });
    } else {
      set({ grid });
    }
  },
  _isLineCorrect: (direction, index) => {
    const { grid } = get();

    switch (direction) {
      case 'row':
        return grid[index].every(isCorrect);
      case 'column':
        return grid.every((row) => isCorrect(row[index]));
    }
  },
}));

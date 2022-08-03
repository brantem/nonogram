import create from 'zustand';

import { Cell, CellStatus, Hint } from 'types/nonogram';

type Direction = 'row' | 'column';

type NonogramState = {
  rows: number;
  columns: number;

  grid: Cell[][];

  setup: (rows: number, columns: number) => void;
  generate: () => void;
  handleCellClick: (row: number, column: number) => void;
  generateHints: (direction: Direction) => Hint[];

  _autoFill: (row: number, column: number) => void;
  _isLineCorrect: (direction: Direction, index: number) => boolean;
};

const isCorrect = (cell: Cell) => cell[0] === 0 || (cell[0] === 1 && cell[1] === CellStatus.Filled);

export const useNonogramStore = create<NonogramState>()((set, get) => ({
  rows: 5,
  columns: 5,

  grid: [],
  hints: { row: [], column: [] },

  setup: (rows, columns) => set({ rows, columns }),
  generate: () => {
    const { rows, columns, _autoFill } = get();

    let grid = new Array(rows);
    for (let i = 0; i < rows; i++) {
      grid[i] = new Array(columns);
      for (let j = 0; j < columns; j++) {
        grid[i][j] = [Math.random() < 0.5 ? 0 : 1];
      }
    }
    set({ grid });

    for (let i = 0; i < rows; i++) {
      _autoFill(i, 0);
    }

    for (let i = 0; i < columns; i++) {
      _autoFill(0, i);
    }
  },
  handleCellClick: (row, column) => {
    const { grid, generate, _autoFill } = get();
    if (!!grid[row][column][1]) return;

    grid[row][column][1] = CellStatus.Filled;
    _autoFill(row, column);

    if (grid.every((row) => row.every(isCorrect))) setTimeout(generate, 500);
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
    const { rows, columns, grid, _isLineCorrect } = get();

    if (_isLineCorrect('row', row)) {
      for (let i = 0; i < columns; i++) {
        grid[row][i][1] = grid[row][i][1] || CellStatus.Marked;
      }
    }

    if (_isLineCorrect('column', column)) {
      for (let i = 0; i < rows; i++) {
        grid[i][column][1] = grid[i][column][1] || CellStatus.Marked;
      }
    }

    set({ grid });
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

import create from 'zustand';

import { Cell, CellStatus } from 'types/nonogram';

type NonogramState = {
  rows: number;
  columns: number;

  grid: Cell[][];
  hints: {
    row: number[][];
    column: number[][];
  };

  setup: (rows: number, columns: number) => void;
  generate: () => void;
  handleCellClick: (row: number, column: number) => void;

  _autoFill: (grid: Cell[][], row: number, column: number) => Cell[][];
  _generateHints: (grid: Cell[][], direction: 'row' | 'column') => number[][];
};

const isCorrect = (cell: Cell) => cell[0] === 0 || (cell[0] === 1 && cell[1] === CellStatus.Filled);

export const useNonogramStore = create<NonogramState>()((set, get) => ({
  rows: 5,
  columns: 5,

  grid: [],
  hints: { row: [], column: [] },

  setup: (rows, columns) => set({ rows, columns }),
  generate: () => {
    const { rows, columns, _autoFill, _generateHints } = get();

    let grid = new Array(rows);
    for (let i = 0; i < rows; i++) {
      grid[i] = new Array(columns);
      for (let j = 0; j < columns; j++) {
        grid[i][j] = [Math.random() < 0.5 ? 0 : 1];
      }
    }

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        grid = _autoFill(grid, i, j);
      }
    }

    const hints = {
      row: _generateHints(grid, 'row'),
      column: _generateHints(grid, 'column'),
    };

    set({ grid, hints });
  },
  handleCellClick: (row, column) => {
    const { grid, generate, _autoFill } = get();
    if (!!grid[row][column][1]) return;

    let _grid = grid;
    _grid[row][column][1] = CellStatus.Filled;

    set({ grid: _autoFill(_grid, row, column) });

    if (_grid.every((row) => row.every(isCorrect))) {
      setTimeout(() => {
        generate();
      }, 250);
    }
  },

  _autoFill: (grid, row, column) => {
    const { rows, columns } = get();

    // column
    if (grid[row].every(isCorrect)) {
      for (let i = 0; i < columns; i++) {
        grid[row][i][1] = grid[row][i][1] || CellStatus.Marked;
      }
    }

    // row
    if (grid.every((row) => isCorrect(row[column]))) {
      for (let i = 0; i < rows; i++) {
        grid[i][column][1] = grid[i][column][1] || CellStatus.Marked;
      }
    }

    return grid;
  },
  _generateHints: (grid, direction) => {
    const { rows, columns } = get();
    let hints = [];

    switch (direction) {
      case 'row':
        for (let i = 0; i < rows; i++) {
          const hint = [];
          let temp = 0;
          for (let j = 0; j < columns; j++) {
            if (grid[i][j][0] === 0) {
              if (temp > 0) hint.push(temp);
              temp = 0;
              continue;
            }
            temp += grid[i][j][0];
          }
          if (temp > 0) hint.push(temp);
          hints.push(hint);
        }
        break;
      case 'column':
        for (let i = 0; i < columns; i++) {
          const hint = [];
          let temp = 0;
          for (let j = 0; j < rows; j++) {
            if (grid[j][i][0] === 0) {
              if (temp > 0) hint.push(temp);
              temp = 0;
              continue;
            }
            temp += grid[j][i][0];
          }
          if (temp > 0) hint.push(temp);
          hints.push(hint);
        }
        break;
    }

    return hints;
  },
}));

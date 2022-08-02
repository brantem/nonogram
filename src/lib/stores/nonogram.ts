import create from 'zustand';

import { Cell, CellStatus, Hint } from 'types/nonogram';

type Direction = 'row' | 'column';

type NonogramState = {
  rows: number;
  columns: number;

  grid: Cell[][];
  hints: {
    row: Hint[];
    column: Hint[];
  };

  setup: (rows: number, columns: number) => void;
  generate: () => void;
  handleCellClick: (row: number, column: number) => void;

  _autoFill: (row: number, column: number) => void;
  _isLineCorrect: (direction: Direction, index: number) => boolean;
  _generateHints: (direction: Direction) => Hint[];
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
    set({ grid });

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        _autoFill(i, j);
      }
    }

    const hints = { row: _generateHints('row'), column: _generateHints('column') };
    set({ hints });
  },
  handleCellClick: (row, column) => {
    const { grid, hints, generate, _autoFill, _isLineCorrect } = get();
    if (!!grid[row][column][1]) return;

    grid[row][column][1] = CellStatus.Filled;
    _autoFill(row, column);

    hints.row[row].isCorrect = _isLineCorrect('row', row);
    hints.column[column].isCorrect = _isLineCorrect('column', column);
    set({ hints });

    if (grid.every((row) => row.every(isCorrect))) setTimeout(generate, 500);
  },

  _autoFill: (row, column) => {
    const { rows, columns, grid, _isLineCorrect } = get();

    // row
    if (_isLineCorrect('row', row)) {
      for (let i = 0; i < columns; i++) {
        grid[row][i][1] = grid[row][i][1] || CellStatus.Marked;
      }
    }

    // row
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
  _generateHints: (direction) => {
    const { rows, columns, grid } = get();
    let hints = [];

    switch (direction) {
      case 'row':
        for (let i = 0; i < rows; i++) {
          const hint: Hint = { lines: [], isCorrect: false };
          let line = 0;
          for (let j = 0; j < columns; j++) {
            if (grid[i][j][0] === 0) {
              if (line > 0) hint.lines.push(line);
              line = 0;
              continue;
            }
            line += grid[i][j][0];
          }
          if (line > 0) hint.lines.push(line);
          hints.push(hint);
        }
        break;
      case 'column':
        for (let i = 0; i < columns; i++) {
          const hint: Hint = { lines: [], isCorrect: false };
          let line = 0;
          for (let j = 0; j < rows; j++) {
            if (grid[j][i][0] === 0) {
              if (line > 0) hint.lines.push(line);
              line = 0;
              continue;
            }
            line += grid[j][i][0];
          }
          if (line > 0) hint.lines.push(line);
          hints.push(hint);
        }
        break;
    }

    return hints;
  },
}));

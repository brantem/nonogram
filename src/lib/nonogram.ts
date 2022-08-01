import { Direction, LineOfHints } from '../types/nonogram';

// https://github.com/HandsomeOne/Nonogram

class Nonogram {
  rows: number;
  columns: number;
  threshold: number;

  grid: boolean[][];

  hints: {
    row: LineOfHints[];
    column: LineOfHints[];
  };

  constructor(rows: number, columns: number, { threshold = 0.5 } = {}) {
    this.rows = rows;
    this.columns = columns;
    this.threshold = threshold;

    this.grid = new Array(this.rows);
    for (let i = 0; i < this.rows; i += 1) {
      this.grid[i] = new Array(this.columns);
      for (let j = 0; j < this.columns; j += 1) {
        this.grid[i][j] = Math.random() < this.threshold ? true : false;
      }
    }

    this.hints = { row: new Array(rows), column: new Array(columns) };
    for (let i = 0; i < this.rows; i += 1) {
      this.hints.row[i] = this.calculateHints('row', i);
    }
    for (let j = 0; j < this.columns; j += 1) {
      this.hints.column[j] = this.calculateHints('column', j);
    }
  }

  getSingleLine(direction: Direction, i: number): boolean[] {
    const columns: boolean[] = [];
    switch (direction) {
      case 'row':
        for (let j = 0; j < this.columns; j += 1) {
          columns[j] = this.grid[i][j];
        }
        break;
      case 'column':
        for (let j = 0; j < this.rows; j += 1) {
          columns[j] = this.grid[j][i];
        }
        break;
    }
    return columns;
  }

  calculateHints(direction: Direction, i: number) {
    const hints: number[] = [];
    const line = this.getSingleLine(direction, i);
    line.reduce((lastIsFilled, cell) => {
      if (cell === true) {
        hints.push(lastIsFilled ? <number>hints.pop() + 1 : 1);
      } else if (cell !== false) {
        throw new Error();
      }
      return cell === true;
    }, false);
    return hints;
  }
}

export default Nonogram;

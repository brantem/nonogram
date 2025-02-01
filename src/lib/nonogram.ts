import { createWithEqualityFn as create } from 'zustand/traditional';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import type * as types from 'types';

const WIDTH = 30;
const HEIGHT = 30;

const generate = (width: number, height: number) => {
  const grid: types.Cell[][] = [];
  const r = new Array(height).fill(true);
  const c = new Array(width).fill(true);

  for (let y = 0; y < height; y++) {
    grid[y] = [];
    for (let x = 0; x < width; x++) {
      const value = Math.random() < 0.5 ? 1 : 0;
      grid[y][x] = [value, -1];

      if (value !== 1) continue;
      r[y] = false;
      c[x] = false;
    }
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (r[y] || c[x]) grid[y][x][1] = 0;
    }
  }

  return grid;
};

type State = {
  width: number;
  height: number;
  size: number;
  grid: types.Cell[][];

  generate(): void;
  paint(coord: types.Coord, v: types.Cell[1]): void;
};

export const useNonogramState = create<State>()(
  devtools(
    immer((set) => ({
      width: WIDTH,
      height: HEIGHT,
      size: 36,
      grid: generate(WIDTH, HEIGHT),

      generate() {
        set((state) => ({ grid: generate(state.width, state.height) }));
      },
      paint(coord, v) {
        const [x, y] = coord;
        set((state) => {
          const cell = state.grid[y][x];
          cell[1] = v;

          // fill the remaining if the vertical line is complete
          if (state.grid.every((cells) => isCellComplete(cells[x]))) {
            state.grid.forEach((cells) => (cells[x][0] ? null : (cells[x][1] = 0)));
          }

          // fill the remaining if the horizontal line is complete
          if (state.grid[y].every(isCellComplete)) {
            state.grid[y].forEach((cell) => (cell[0] ? null : (cell[1] = 0)));
          }
        });
      },
    })),
    { name: 'nonogram' },
  ),
);

const isCellComplete = (cell: types.Cell) => {
  if (cell[0] === 0) return cell[1] === -1 || cell[1] === 0; // if 0, either empty or filled with 0
  if (cell[0] === 1) return cell[1] === 1; // if 1, it must be filled with 1
  return true; // if 1 but empty, if 0 but filled with 1 and if 1 but filled with 0
};

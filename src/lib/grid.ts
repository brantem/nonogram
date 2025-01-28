import { createWithEqualityFn as create } from 'zustand/traditional';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import type { Cell } from 'types';

const SIZE = 5;

const generate = (size: number) => {
  const grid: Cell[][] = [];
  const r = new Array(size).fill(true);
  const c = new Array(size).fill(true);

  for (let y = 0; y < size; y++) {
    grid[y] = [];
    for (let x = 0; x < size; x++) {
      const value = Math.random() < 0.5 ? 1 : 0;
      grid[y][x] = [value];

      if (value !== 1) continue;
      r[y] = false;
      c[x] = false;
    }
  }

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (r[y] || c[x]) grid[y][x][1] = 1;
    }
  }

  return grid;
};

type State = {
  size: number;
  grid: Cell[][];

  generate(): void;
  paint(x: number, y: number): void;
};

export const useGridState = create<State>()(
  devtools(
    immer((set) => ({
      size: SIZE,
      grid: generate(SIZE),

      generate() {
        set((state) => ({ grid: generate(state.size) }));
      },
      paint(x, y) {
        set((state) => {
          const cell = state.grid[y][x];
          cell[1] = 1;

          // fill the remaining if the vertical line is complete
          if (state.grid.every((cells) => (cells[x][0] ? cells[x][1] : true))) {
            state.grid.forEach((cells) => (cells[x][1] = 1));
          }

          // fill the remaining if the horizontal line is complete
          if (state.grid[y].every((cell) => (cell[0] ? cell[1] : true))) {
            state.grid[y].forEach((cell) => (cell[1] = 1));
          }
        });
      },
    })),
  ),
);

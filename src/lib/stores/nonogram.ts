import create from 'zustand';

import Nonogram from '../nonogram';

type NonogramState = {
  rows: number;
  columns: number;

  grid: Nonogram['grid'];
  hints: Nonogram['hints'];

  setup: (rows: number, columns: number) => void;
  generate: () => void;
};

export const useNonogramStore = create<NonogramState>((set, get) => ({
  rows: 5,
  columns: 5,

  grid: [],
  hints: { row: [], column: [] },

  setup: (rows, columns) => set({ rows, columns }),
  generate: () => {
    const { rows, columns } = get();
    const nonogram = new Nonogram(rows, columns);
    set({ grid: nonogram.grid, hints: nonogram.hints });
  },
}));

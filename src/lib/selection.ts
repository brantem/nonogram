import { createWithEqualityFn as create } from 'zustand/traditional';
import { devtools } from 'zustand/middleware';

import type * as types from 'types';

type State = {
  active: boolean;
  value: types.Cell[1];
  coords: [] | [types.Coord, types.Coord?];

  start(value: State['value'], coord: types.Coord): void;
  move(coord: types.Coord): void;
  end(): void;
};

export const useSelectionState = create<State>()(
  devtools(
    (set, get) => ({
      active: false,
      value: -1,
      coords: [],

      start(value, coord) {
        set({ active: true, value, coords: [coord] });
      },
      move(coord) {
        const { active, coords } = get();
        if (!active) return;

        const [start, end] = coords;
        if (!start) return;

        const [x1, y1] = start;
        const [x3, y3] = coord;

        if (!end) {
          if (x1 !== x3 && y1 !== y3) return set({ coords: [coord] }); // diagonal
          return set({ coords: [start, coord] });
        }

        const [x2, y2] = end;

        const isVertical = x1 === x2;
        const isHorizontal = y1 === y2;
        const isNewVertical = x2 === x3;
        const isNewHorizontal = y2 === y3;

        const isVerticalToHorizontal = isVertical && !isNewVertical && isNewHorizontal; // the last check is needed to not catch the diagonal
        const isHorizontalToVertical = isHorizontal && !isNewHorizontal && isNewVertical; // the last check is needed to not catch the diagonal

        if (isVerticalToHorizontal || isHorizontalToVertical) return set({ coords: [end, coord] }); // start from the previous line end
        if (x1 !== x3 && y1 !== y3) return set({ coords: [coord] }); // diagonal
        set({ coords: [start, coord] });
      },
      end() {
        if (!get().active) return;
        set({ active: false, value: -1, coords: [] });
      },
    }),
    { name: 'selection' },
  ),
);

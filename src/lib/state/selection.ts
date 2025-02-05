import { proxy, subscribe } from 'valtio';
import { devtools } from 'valtio/utils';

import type * as types from 'types';
import * as nonogram from './nonogram';

type Data = {
  value: types.Cell[1];
  coords: [] | [types.Coord, types.Coord];
};

export const data = proxy<Data>({ value: -1, coords: [] });
devtools(data, { name: 'selection.data' });

subscribe(data, () => {
  if (data.coords.length !== 2) return;
  nonogram.paint(data.coords[0], data.coords[1], data.value);
});

export function start(coord: types.Coord, value: types.Cell[1]) {
  data.value = value;
  data.coords = [coord, coord];
}

export function move(coord: types.Coord) {
  if (!data.coords.length) return;

  const [start, end] = data.coords;
  if (!start) return;

  const [x1, y1] = start;
  const [x3, y3] = coord;

  if (!end) {
    if (x1 !== x3 && y1 !== y3) data.coords.splice(0); // diagonal
    return data.coords.push(coord);
  }

  const [x2, y2] = end;

  const isHorizontal = y1 === y2;
  const isVertical = x1 === x2;
  const isNewHorizontal = y2 === y3;
  const isNewVertical = x2 === x3;

  const isHorizontalToVertical = isHorizontal && !isNewHorizontal && isNewVertical; // the last check is needed to not catch the diagonal
  const isVerticalToHorizontal = isVertical && !isNewVertical && isNewHorizontal; // the last check is needed to not catch the diagonal

  data.coords[1] = coord;
  if (x1 !== x3 && y1 !== y3) data.coords[0] = coord; // diagonal
  if (isHorizontalToVertical || isVerticalToHorizontal) data.coords[0] = end; // start from the previous line end
}

export function end() {
  if (!data.coords.length) return;
  data.value = -1;
  data.coords.splice(0);
}

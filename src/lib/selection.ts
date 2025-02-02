import type * as types from 'types';
import { proxy } from 'valtio';

type Data = {
  value: types.Cell[1];
  coords: types.Coord[]; // TODO: [] | [types.Coord, types.Coord?]
};

export const data = proxy<Data>({ value: -1, coords: [] });

export function start(value: types.Cell[1], coord: types.Coord) {
  data.value = value;
  data.coords = [coord];
}

export function move(coord: types.Coord) {
  if (!data.coords) return;

  const [start, end] = data.coords;
  if (!start) return;

  const [x1, y1] = start;
  const [x3, y3] = coord;

  if (!end) {
    if (x1 !== x3 && y1 !== y3) data.coords.splice(0); // diagonal
    return data.coords.push(coord);
  }

  const [x2, y2] = end;

  const isVertical = x1 === x2;
  const isHorizontal = y1 === y2;
  const isNewVertical = x2 === x3;
  const isNewHorizontal = y2 === y3;

  const isVerticalToHorizontal = isVertical && !isNewVertical && isNewHorizontal; // the last check is needed to not catch the diagonal
  const isHorizontalToVertical = isHorizontal && !isNewHorizontal && isNewVertical; // the last check is needed to not catch the diagonal

  // start from the previous line end
  if (isVerticalToHorizontal || isHorizontalToVertical) {
    data.coords.splice(0);
    return data.coords.push(end, coord);
  }

  // diagonal
  if (x1 !== x3 && y1 !== y3) {
    data.coords.splice(0);
    return data.coords.push(coord);
  }

  data.coords[1] = coord;
}

export function end() {
  if (!data.coords.length) return;
  data.value = -1;
  data.coords = [];
}

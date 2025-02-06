import { proxy } from 'valtio';
import { devtools } from 'valtio/utils';

import type * as types from 'types';

// had to shape it like this mess to make sure only the affected  rows/columns
// re-render. any other shape would cause everything to re-render whenever `set`
//  is called.

type Data = {
  x: Record<number, boolean>;
  y: Record<number, boolean>;
};

export const data = proxy<Data>({ x: {}, y: {} });
devtools(data, { name: 'highlight.data' });

export function set(coord: types.Coord) {
  data.x = { [coord[0]]: true };
  data.y = { [coord[1]]: true };
}

export function clear() {
  data.x = {};
  data.y = {};
}

import { proxy } from 'valtio';
import { devtools } from 'valtio/utils';

import type * as types from 'types';

type Data = {
  coord: Record<number, 0 | 1>; // 0 = column, 1 = row
};

export const data = proxy<Data>({ coord: {} });
devtools(data, { name: 'highlight.data' });

export function set(coord: types.Coord) {
  data.coord = { [coord[0]]: 0, [coord[1]]: 1 }; // need to translate to object to improve performance
}

export function clear() {
  data.coord = {};
}

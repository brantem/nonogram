import { proxy, subscribe } from 'valtio';

import type * as types from 'types';
import * as nonogram from 'lib/state/nonogram';

export type Handle = {
  generate(): void;
};

type State = {
  width: number;
  height: number;

  isGenerating: boolean;
  grid: types.Cell[][];
};

export const state = proxy<State>({
  width: nonogram.size.width,
  height: nonogram.size.height,

  isGenerating: false,
  grid: [],
});

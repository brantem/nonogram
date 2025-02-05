import { proxy, subscribe } from 'valtio';
import { devtools } from 'valtio/utils';
import { derive } from 'derive-valtio';

import type * as types from 'types';
import { padStart } from '../helpers';
import Worker from '../worker?worker';

function _generate(width: number, height: number) {
  const grid: types.Cell[][] = [];
  const r = new Array(height).fill(true);
  const c = new Array(width).fill(true);

  for (let y = 0; y < height; y++) {
    grid[y] = [];
    for (let x = 0; x < width; x++) {
      const value = Math.random() < 0.5 ? 1 : 0;
      grid[y][x] = [value];

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
}

type Settings = {
  width: number;
  height: number;
  cell: {
    size: number;
  };
  isVisible: boolean;
};

if (!localStorage.getItem('settings')) {
  localStorage.setItem('settings', JSON.stringify({ width: 30, height: 30, cell: { size: 24 }, isVisible: true }));
}
export const settings = proxy<Settings>(JSON.parse(localStorage.getItem('settings')!));
devtools(settings, { name: 'nonogram.settings' });
subscribe(settings, () => localStorage.setItem('settings', JSON.stringify(settings)));

if (!localStorage.getItem('grid')) {
  localStorage.setItem('grid', JSON.stringify(_generate(settings.width, settings.height)));
}
export const grid = proxy<types.Cell[][]>(JSON.parse(localStorage.getItem('grid')!));
devtools(grid, { name: 'nonogram.grid' });
subscribe(grid, () => localStorage.setItem('grid', JSON.stringify(grid)));

export const hints = derive({
  top: (get) => {
    const _grid = get(grid);

    const hints = [];
    for (let x = 0; x < settings.width; x++) {
      let arr: types.Hint[] = [];
      let temp = 0;
      let match = 0;
      for (let y = 0; y < settings.height; y++) {
        const cell = _grid[y][x];
        if (cell[0]) {
          temp++;
          if (cell[0] === cell[1]) match++;
        } else {
          if (temp) arr.push([temp, temp === match ? 1 : 0]);
          temp = match = 0;
        }
      }
      if (temp) arr.push([temp, temp === match ? 1 : 0]);
      hints.push(arr);
    }
    const max = Math.max(...hints.map((arr) => arr.length));
    return hints.map((arr) => padStart(arr, max, [0]));
  },
  left: (get) => {
    const hints = get(grid).map((cells) => {
      let arr: types.Hint[] = [];
      let temp = 0;
      let match = 0;
      cells.forEach((cell) => {
        if (cell[0]) {
          temp++;
          if (cell[0] === cell[1]) match++;
          return;
        }
        if (temp) arr.push([temp, temp === match ? 1 : 0]);
        temp = match = 0;
      });
      if (temp) arr.push([temp, temp === match ? 1 : 0]);
      return arr;
    }, []);
    const max = Math.max(...hints.map((arr) => arr.length));
    return hints.map((arr) => padStart(arr, max, [0]));
  },
});
devtools(settings, { name: 'nonogram.settings' });

export function generate() {
  grid.splice(0);
  Object.assign(grid, _generate(settings.width, settings.height));
}

export async function generateFromFile(file: File) {
  const worker = new Worker();
  worker.postMessage({ file, options: { width: settings.width, height: settings.height } });

  worker.onmessage = (e) => {
    const { status, ...message } = e.data;
    switch (status) {
      case 'success':
        grid.splice(0);
        Object.assign(grid, message.data);
        return;
      default:
        // TODO
        console.log({ status, ...message });
    }
  };
  worker.onerror = (err) => {
    // TODO
    console.error('error:', err);
  };
}

export function paint(coord1: types.Coord, coord2: types.Coord, v: types.Cell[1]) {
  const [x1, y1] = coord1;
  const [x2, y2] = coord2;

  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);
  const sx = Math.sign(x2 - x1); // x2 > x1 = right, x2 < x1 = left
  const sy = Math.sign(y2 - y1); // y2 > y1 = down, y2 < y1 = up

  for (let i = 0; i <= dy; i++) {
    for (let j = 0; j <= dx; j++) {
      grid[y1 + i * sy][x1 + j * sx][1] = v;
    }
  }

  for (let i = 0; i <= dx; i++) autoFill('vertical', x1 + i * sx);
  for (let i = 0; i <= dy; i++) autoFill('horizontal', y1 + i * sy);
}

function autoFill(orientation: 'horizontal' | 'vertical', i: number) {
  // fill the remaining if the vertical line is complete
  if (orientation === 'vertical' && grid.every((cells) => isCellComplete(cells[i]))) {
    grid.forEach((cells) => (cells[i][0] ? null : (cells[i][1] = 0)));
  }

  // fill the remaining if the horizontal line is complete
  if (orientation === 'horizontal' && grid[i].every(isCellComplete)) {
    grid[i].forEach((cell) => (cell[0] ? null : (cell[1] = 0)));
  }
}

function isCellComplete(cell: types.Cell) {
  if (cell[0] === 0) return cell[1] === undefined || cell[1] === -1 || cell[1] === 0; // if 0, either empty or filled with 0
  if (cell[0] === 1) return cell[1] === 1; // if 1, it must be filled with 1
  return true; // if 1 but empty, if 0 but filled with 1 and if 1 but filled with 0
}

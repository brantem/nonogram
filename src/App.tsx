import { useAtom, useAtomValue } from 'jotai';
import { atomWithImmer } from 'jotai-immer';

import type { Cell } from 'types';

// TODO: support other size

const SIZE = 5;

const generate = (size: number, fillProbability = 0.5) => {
  const grid = [];
  for (let y = 0; y < size; y++) {
    const row: Cell[] = [];
    for (let x = 0; x < size; x++) row.push([Math.random() < fillProbability ? 1 : 0]);
    grid.push(row);
  }
  return grid;
};

const $grid = atomWithImmer<Cell[][]>(generate(SIZE));

function App() {
  return (
    <div className="flex h-full flex-col justify-between gap-y-4 select-none sm:gap-y-8">
      <div />

      <div className="grid aspect-square grid-cols-4 grid-rows-4 text-center text-2xl font-semibold tabular-nums md:text-3xl dark:text-white">
        <Top />
        <Left />
        <Board />
      </div>

      <div />
    </div>
  );
}

export default App;

const padStart = (arr: any[], len: number, fill: any) => {
  return [...new Array(len - arr.length).fill(fill), ...arr];
};

function Top() {
  const grid = useAtomValue($grid);

  let hints = [];
  for (let y = 0; y < SIZE; y++) {
    let arr = [];
    let temp = 0;
    for (let x = 0; x < SIZE; x++) {
      if (grid[x][y][0]) {
        temp++;
      } else {
        if (temp) arr.push(temp);
        temp = 0;
      }
    }
    if (temp > 0) arr.push(temp);
    hints.push(padStart(arr, 3, 0));
  }

  return (
    <div className="col-span-3 col-start-2 flex rounded-t">
      {hints.map((cells, i) => (
        <div key={i} className="flex w-1/5 flex-col justify-around pb-1 md:pb-2">
          {cells.map((cell, i) => (cell ? <span key={i}>{cell}</span> : <span key={i}>&nbsp;</span>))}
        </div>
      ))}
    </div>
  );
}

function Left() {
  const hints = useAtomValue($grid).map((cells) => {
    let arr = [];
    let temp = 0;
    cells.forEach((cell) => {
      if (cell[0]) return temp++;
      if (temp) arr.push(temp);
      temp = 0;
    });
    if (temp) arr.push(temp);
    return padStart(arr, 3, 0);
  }, [] as number[][]);

  return (
    <div className="row-span-3 row-start-2 flex flex-col rounded-l">
      {hints.map((cells, i) => (
        <div key={i} className="grid flex-1 grid-cols-3 items-center pr-1 md:pr-2">
          {cells.map((cell, i) => (cell ? <span key={i}>{cell}</span> : <span key={i} />))}
        </div>
      ))}
    </div>
  );
}

function Board() {
  const [grid, setGrid] = useAtom($grid);

  const paint = (x: number, y: number) => {
    setGrid((prev) => {
      const cell = prev[y][x];
      cell[1] = cell[0] ? 1 : 0;

      // TODO: auto fill
      // TODO: check complete
    });
  };

  return (
    <div
      className="col-span-3 row-span-3 grid aspect-square grid-rows-5 divide-y rounded-md border-3 bg-white"
      onTouchMove={(e) => {
        const { clientX, clientY } = e.touches[0];
        const el = document.elementFromPoint(clientX, clientY);
        if (!el?.classList.contains('cell')) return;
        paint(parseInt(el.getAttribute('data-x')!), parseInt(el.getAttribute('data-y')!));
      }}
    >
      {grid.map((cells, y) => (
        <div key={y} className="grid grid-cols-5 divide-x">
          {cells.map((cell, x) => {
            switch (cell[1]) {
              case 0:
                return (
                  <div key={x} className="p-1.5">
                    <div className="flex size-full items-center justify-center text-red-500">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="size-3/4">
                        <path
                          d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                  </div>
                );
              case 1:
                return (
                  <div key={x} className="p-1.5">
                    <div className="size-full rounded bg-black dark:bg-white" />
                  </div>
                );
              default:
                return (
                  <div key={x} className="cell cursor-pointer" data-x={x} data-y={y} onClick={() => paint(x, y)} />
                );
            }
          })}
        </div>
      ))}
    </div>
  );
}

import Hint from './Hint';

import type * as types from 'types';
import { useGridState } from 'lib/grid';
import { padStart } from 'lib/helpers';

export default function Top() {
  const hints = useGridState((state) => {
    const hints = [];
    for (let x = 0; x < state.width; x++) {
      let arr: types.Hint[] = [];
      let temp = 0;
      let match = 0;
      for (let y = 0; y < state.height; y++) {
        const cell = state.grid[y][x];
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
  });

  const n = Math.ceil(hints.length / 5);

  return (
    <div className="flex divide-x-[3px] divide-neutral-500 border-[2px] border-neutral-500">
      {[...new Array(n)].map((_, i) => {
        const start = i * 5;
        const end = start + 5;
        return <Hints key={i} hints={hints.slice(start, end)} />;
      })}
    </div>
  );
}

function Hints({ hints }: { hints: types.Hint[][] }) {
  return (
    <div className="flex divide-x divide-neutral-500">
      {hints.map((hints, i) => (
        <div key={i} className="flex flex-col divide-y divide-neutral-500">
          {hints.map((hint, i) => (
            <Hint key={i} hint={hint} />
          ))}
        </div>
      ))}
    </div>
  );
}

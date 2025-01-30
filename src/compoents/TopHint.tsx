import { useGridState } from 'lib/grid';
import { padStart } from 'lib/helpers';

export default function TopHint() {
  const hints = useGridState((state) => {
    const hints = [];
    for (let x = 0; x < state.width; x++) {
      let arr = [];
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

  return (
    <div
      className="grid grid-cols-[repeat(var(--width),var(--cell-size))] gap-px border-2 border-neutral-500"
      style={{ '--rows': hints[0].length } as React.CSSProperties}
    >
      {hints.map((cells, i) => (
        <div key={i} className="grid grid-rows-[repeat(var(--rows),var(--cell-size))] gap-px">
          {cells.map((cell, i) =>
            cell[0] ? (
              <div key={i} className="flex items-center justify-center bg-white dark:bg-neutral-800">
                <span className={cell[1] ? 'opacity-50' : undefined}>{cell[0]}</span>
              </div>
            ) : (
              <div key={i} className="bg-white dark:bg-neutral-800" />
            ),
          )}
        </div>
      ))}
    </div>
  );
}

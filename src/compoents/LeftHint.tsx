import { cn, padStart } from 'lib/helpers';
import { useGridState } from 'lib/grid';

export default function LeftHint() {
  const hints = useGridState((state) => {
    const hints = state.grid.map((cells) => {
      let arr = [];
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
    }, [] as number[][]);
    const max = Math.max(...hints.map((arr) => arr.length));
    return hints.map((arr) => padStart(arr, max, [0]));
  });

  return (
    <div
      className="grid grid-rows-[repeat(var(--height),var(--cell-size))] gap-px border-2 border-neutral-500"
      style={{ '--cols': hints[0].length } as React.CSSProperties}
    >
      {hints.map((cells, i) => (
        <div key={i} className="grid grid-cols-[repeat(var(--cols),var(--cell-size))] gap-px">
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

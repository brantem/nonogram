import { useGridState } from 'lib/grid';
import { padStart } from 'lib/helpers';

export default function TopHint() {
  const hints = useGridState((state) => {
    let hints = [];
    for (let y = 0; y < state.size; y++) {
      let arr = [];
      let temp = 0;
      for (let x = 0; x < state.size; x++) {
        if (state.grid[x][y][0]) {
          temp++;
        } else {
          if (temp) arr.push(temp);
          temp = 0;
        }
      }
      if (temp > 0) arr.push(temp);
      hints.push(padStart(arr, 3, 0));
    }
    return hints;
  });

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

import { useGridState } from 'lib/grid';
import { padStart } from 'lib/helpers';

export default function LeftHint() {
  const hints = useGridState((state) =>
    state.grid.map((cells) => {
      let arr = [];
      let temp = 0;
      cells.forEach((cell) => {
        if (cell[0]) return temp++;
        if (temp) arr.push(temp);
        temp = 0;
      });
      if (temp) arr.push(temp);
      return padStart(arr, 3, 0);
    }, [] as number[][]),
  );

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

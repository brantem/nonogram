import Cell from 'components/Cell';

import { useNonogramStore } from 'lib/stores';

const Grid = () => {
  const { rows, columns, grid } = useNonogramStore();

  return (
    <>
      <style jsx>{`
        #grid {
          display: grid;
          grid-template-rows: repeat(${rows}, var(--cell-size));
          grid-template-columns: repeat(${columns}, var(--cell-size));
          gap: 1px;
          border: 1px solid black;
          border-radius: 0.25rem;
          overflow: hidden;
          background-color: black;
        }

        @media (prefers-color-scheme: dark) {
          #grid {
            background-color: white;
            border: 1px solid white;
          }
        }
      `}</style>

      <div id="grid">
        {grid.map((row, i) => row.map((cell, j) => <Cell key={'' + i + j} row={i} column={j} cell={cell} />))}
      </div>
    </>
  );
};

export default Grid;

import { useNonogramStore } from 'lib/stores';
import { CellStatus } from 'types/nonogram';

const Grid = () => {
  const { rows, columns, grid, handleCellClick } = useNonogramStore();

  return (
    <>
      <style jsx>{`
        #grid {
          display: grid;
          grid-template-rows: repeat(${rows}, var(--grid-item-size));
          grid-template-columns: repeat(${columns}, var(--grid-item-size));
          gap: 1px;
          border: 1px solid black;
          border-radius: 0.25rem;
          overflow: hidden;
          background-color: black;
        }

        .grid-item {
          height: var(--grid-item-size);
          width: var(--grid-item-size);
          cursor: pointer;
          line-height: var(--grid-item-size);
          text-align: center;
          background-color: white;
          border: 0;
        }

        @media (prefers-color-scheme: dark) {
          #grid {
            background-color: white;
            border: 1px solid white;
          }

          .grid-item {
            background-color: black;
          }
        }

        .grid-item.filled,
        .grid-item.failed,
        .grid-item.marked {
          cursor: default;
        }

        .grid-item.filled {
          background-color: hsl(120, 100%, 80%);
        }

        .grid-item.failed {
          background-color: hsl(0, 100%, 80%);
        }
      `}</style>

      <div id="grid">
        {grid.map((row, i) =>
          row.map((cell, j) => (
            <button
              key={'' + i + j}
              className={
                'grid-item' +
                (cell[1] === CellStatus.Filled
                  ? cell[0] === 1
                    ? ' filled'
                    : ' failed'
                  : cell[1] === CellStatus.Marked
                  ? ' marked'
                  : '')
              }
              onClick={() => handleCellClick(i, j)}
            >
              {cell[1] === CellStatus.Marked ? '✕' : ''}
            </button>
          ))
        )}
      </div>
    </>
  );
};

export default Grid;

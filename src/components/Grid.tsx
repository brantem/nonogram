import { useNonogramStore } from 'lib/stores';
import { CellStatus } from 'types/nonogram';

const Grid = () => {
  const { rows, columns, grid, handleCellClick } = useNonogramStore();

  return (
    <>
      <style jsx>{`
        .grid {
          display: grid;
          grid-template-rows: repeat(${rows}, var(--grid-item-size));
          grid-template-columns: repeat(${columns}, var(--grid-item-size));
          grid-gap: 0.5rem;
        }

        .grid-item {
          border-width: 1px;
          border-style: solid;
          border-color: black;
          border-radius: 0.25rem;
          height: var(--grid-item-size);
          width: var(--grid-item-size);
          cursor: pointer;
          line-height: var(--grid-item-size);
          text-align: center;
        }

        @media (prefers-color-scheme: dark) {
          .grid-item {
            border-color: white;
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

      <div className="grid">
        {grid.map((row, i) =>
          row.map((cell, j) => (
            <div
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
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Grid;

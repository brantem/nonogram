import { MouseEvent } from 'react';
import { Cell, CellStatus } from 'types/nonogram';
import { useNonogramStore } from 'lib/stores';

type CellProps = {
  row: number;
  column: number;
  cell: Cell;
};

const Cell = ({ row, column, cell }: CellProps) => {
  const { isDragging, startDragging, paintCell, paintCellByElement } = useNonogramStore();

  return (
    <>
      <style jsx>{`
        .cell {
          height: var(--cell-size);
          width: var(--cell-size);
          cursor: pointer;
          line-height: var(--cell-size);
          text-align: center;
          background-color: white;
          border: 0;
        }

        @media (prefers-color-scheme: dark) {
          .cell {
            background-color: black;
          }
        }

        .cell.filled,
        .cell.failed,
        .cell.marked {
          cursor: default;
        }

        .cell.filled {
          background-color: hsl(120, 100%, 80%);
        }

        .cell.failed {
          background-color: hsl(0, 100%, 80%);
        }
      `}</style>

      <button
        className={
          'cell' +
          (cell[1] === CellStatus.Filled
            ? cell[0] === 1
              ? ' filled'
              : ' failed'
            : cell[1] === CellStatus.Marked
            ? ' marked'
            : '')
        }
        data-row={row}
        data-column={column}
        onMouseDown={() => {
          startDragging();
          paintCell(row, column);
        }}
        onTouchStart={() => {
          startDragging();
          paintCell(row, column);
        }}
        onMouseEnter={(e) => {
          if (!isDragging) return;
          paintCellByElement(e.currentTarget);
        }}
      >
        {cell[1] === CellStatus.Marked ? '✕' : ''}
      </button>
    </>
  );
};

export default Cell;

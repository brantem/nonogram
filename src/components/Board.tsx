import { Fragment } from 'react';

import type * as types from 'types';
import { cn } from 'lib/helpers';
import { useNonogramState } from 'lib/nonogram';
import { useSelectionState } from 'lib/selection';

export default function Board() {
  const nonogram = useNonogramState((state) => ({ grid: state.grid, generate: state.generate }));
  const isComplete = nonogram.grid.every((cells) => cells.every((cell) => cell[0] === cell[1]));

  const groups = Math.ceil(nonogram.grid.length / 5);

  return (
    <div id="board" className="relative border-[2px] border-neutral-500" onContextMenu={(e) => e.preventDefault()}>
      <Selection />

      <div className="flex flex-col divide-y-[3px] divide-neutral-500">
        {[...new Array(groups)].map((_, i) => {
          const start = i * 5;
          const end = start + 5;
          return <Rows key={i} _y={start} rows={nonogram.grid.slice(start, end)} isLast={i === groups - 1} />;
        })}
      </div>

      {isComplete && (
        <div className="absolute inset-0 flex h-full w-full items-center justify-center rounded-md bg-white/75 dark:bg-black/75">
          <button
            className="rounded-full bg-neutral-700 px-6 py-1.5 text-lg text-white hover:bg-neutral-600 dark:bg-white dark:text-neutral-700 dark:hover:bg-neutral-200"
            onClick={nonogram.generate}
          >
            New Board
          </button>
        </div>
      )}
    </div>
  );
}

enum Direction {
  LR, // left-right
  RL, // right-left
  TB, // top-bottom
  BT, // bottom-top
}

function Selection() {
  const [style, direction, distance] = useSelectionState((state) => {
    if (!state.coords.length) return [null, Direction.LR, 0];

    const [[x1, y1], end, direction] = (() => {
      const [start, end] = state.coords;
      const [x1, y1] = start;

      if (!end) return [start, null, Direction.LR];

      const [x2, y2] = end;

      if (x1 > x2) return [end, start, Direction.RL]; // right-left -> left-right
      if (x1 === x2 && y1 > y2) return [end, start, Direction.BT]; // bottom-top -> top-bottom
      return [start, end, x1 === x2 ? Direction.TB : Direction.LR];
    })();
    const [x2, y2] = end || [0, 0];

    const board = document.getElementById('board')?.getBoundingClientRect();
    if (!board) return [null, Direction.LR, 0];

    const cell1 = document.querySelector(`[data-c="${x1}.${y1}"]`)?.getBoundingClientRect();
    const cell2 = end ? document.querySelector(`[data-c="${x2}.${y2}"]`)?.getBoundingClientRect() : cell1;
    if (!cell1 || !cell2) return [null, Direction.LR, 0];

    return [
      {
        top: cell1.top - board.top - /* <Board /> border */ 2 - /* <Selection /> border */ 5,
        left: cell1.left - board.left - /* <Board /> border */ 2 - /* <Selection /> border */ 5,
        height: cell2.bottom - cell1.top + 10 /* <Selection /> border * 2 */,
        width: cell2.right - cell1.left + 10 /* <Selection /> border * 2 */,
      },
      direction,
      (end ? Math.abs(x2 - x1) /* x */ || Math.abs(y2 - y1) /* y */ : 0) + 1,
    ];
  });
  if (!style) return;

  const isFirstRow = style.top === -5;
  const isHorizontal = direction === Direction.LR || direction === Direction.RL;
  const isVertical = direction === Direction.TB || direction === Direction.BT;

  return (
    <div
      className={cn(
        'pointer-events-none absolute z-10 flex border-[5px] border-yellow-400',
        direction !== Direction.RL && 'justify-end',
        direction === Direction.TB && 'items-end',
      )}
      style={style}
    >
      {distance > 1 ? (
        <div
          className={cn(
            'size-(--cell-size) p-1',
            isHorizontal && (isFirstRow ? 'mt-(--cell-size)' : '-mt-(--cell-size)'),
            isVertical && '-mr-(--cell-size)',
          )}
        >
          <div
            className={cn(
              'flex size-full items-center justify-center rounded border-2 border-black bg-white text-base leading-none text-black',
            )}
          >
            {distance}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Rows({ _y, rows, isLast }: { _y: number; rows: types.Cell[][]; isLast: boolean }) {
  return (
    <div className="relative">
      <div className="flex flex-col divide-y divide-neutral-500">
        {rows.map((row, i) => (
          <div key={i} className="flex divide-x-[3px] divide-neutral-500">
            {[...new Array(Math.ceil(row.length / 5))].map((_, j) => {
              const start = j * 5;
              const end = start + 5;
              const cells = row.slice(start, end);
              return isLast ? (
                <div key={j} className="relative">
                  <Cells _x={start} _y={_y + i} cells={cells} />

                  <span className="absolute top-[calc(100%+var(--spacing)*2)] right-0 text-base leading-none text-black">
                    {start + cells.length}
                  </span>
                </div>
              ) : (
                <Cells key={j} _x={start} _y={_y + i} cells={cells} />
              );
            })}
          </div>
        ))}
      </div>

      <span className="absolute bottom-0 left-[calc(100%+var(--spacing)*2)] text-base leading-none text-black">
        {_y + rows.length}
      </span>
    </div>
  );
}

function Cells({ _x, _y, cells }: { _x: number; _y: number; cells: types.Cell[] }) {
  // can't use divide-x; it adds 1px to cell width
  return (
    <div className="flex items-stretch">
      {cells.map((cell, i) => {
        return (
          <Fragment key={i}>
            <Cell x={_x + i} y={_y} cell={cell} />
            {i !== cells.length - 1 && <div className="w-px bg-neutral-500" />}
          </Fragment>
        );
      })}
    </div>
  );
}

function Cell({ x, y, cell }: { x: number; y: number; cell: types.Cell }) {
  const selection = useSelectionState();
  const paint = useNonogramState((state) => state.paint);

  const coord = [x, y] satisfies types.Coord;
  const isMatch = cell[0] === cell[1];

  return (
    <div
      className="cell box-content flex size-[calc(var(--cell-size)-var(--spacing)*2)] cursor-pointer items-center justify-center bg-white p-1 dark:bg-neutral-800"
      data-c={`${x}.${y}`}
      onPointerDown={(e) => {
        let v = buttonToValue(e.button);
        if (v === -1) return;
        if (v === cell[1]) v = -1;

        selection.start(v, coord);
        paint(coord, v);
      }}
      onPointerEnter={() => {
        if (!selection.coords.length) return;
        selection.move(coord);
        paint(coord, selection.value);
      }}
    >
      {(() => {
        switch (cell[1]) {
          case 0:
            return (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 384 512"
                className={cn('aspect-square', !isMatch && 'text-rose-500')}
              >
                <path
                  d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
                  fill="currentColor"
                />
              </svg>
            );
          case 1:
            return (
              <div className={cn('size-full rounded', isMatch ? 'bg-black dark:bg-neutral-300' : 'bg-rose-500')} />
            );
          default:
            return;
        }
      })()}
    </div>
  );
}

function buttonToValue(button: number): -1 | 0 | 1 {
  switch (button) {
    case 0:
      return 1;
    case 2:
      return 0;
    default:
      return -1;
  }
}

import { useRef } from 'react';

import type * as types from 'types';
import { cn } from 'lib/helpers';
import { useNonogramState } from 'lib/nonogram';

export default function Board() {
  const { grid, generate, paint } = useNonogramState((state) => ({
    grid: state.grid,
    generate: state.generate,
    paint(clientX: number, clientY: number, v: -1 | types.Cell[1]) {
      if (v === -1) return;
      const el = document.elementsFromPoint(clientX, clientY).find((el) => el.classList.contains('cell'));
      if (!el) return;
      state.paint(parseInt(el.getAttribute('data-x')!), parseInt(el.getAttribute('data-y')!), v);
    },
  }));
  const isComplete = grid.every((cells) => cells.every((cell) => cell[0] === cell[1]));

  const isDraggingRef = useRef(false);
  const buttonRef = useRef(-1);

  const groups = Math.ceil(grid.length / 5);

  return (
    <div id="board" className="relative border-[2px] border-neutral-500" onContextMenu={(e) => e.preventDefault()}>
      <div
        className="flex flex-col divide-y-[3px] divide-neutral-500"
        onPointerDown={(e) => {
          if (!(e.button === 0 || e.button === 2)) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          isDraggingRef.current = true;
          buttonRef.current = e.button;
          paint(e.clientX, e.clientY, buttonToValue(e.button));
        }}
        onPointerUp={(e) => {
          if (!isDraggingRef.current) return;
          e.currentTarget.releasePointerCapture(e.pointerId);
          isDraggingRef.current = false;
          buttonRef.current = -1;
        }}
        onPointerMove={(e) => {
          if (!isDraggingRef.current || buttonRef.current === -1) return;
          paint(e.clientX, e.clientY, buttonToValue(buttonRef.current));
        }}
      >
        {[...new Array(groups)].map((_, i) => {
          const start = i * 5;
          const end = start + 5;
          return <Rows key={i} _y={start} rows={grid.slice(start, end)} isLast={i === groups - 1} />;
        })}
      </div>

      {isComplete && (
        <div className="absolute inset-0 flex h-full w-full items-center justify-center rounded-md bg-white/75 dark:bg-black/75">
          <button
            className="rounded-full bg-neutral-700 px-6 py-1.5 text-lg text-white hover:bg-neutral-600 dark:bg-white dark:text-neutral-700 dark:hover:bg-neutral-200"
            onClick={() => generate()}
          >
            New Board
          </button>
        </div>
      )}
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
  return (
    <div className="flex divide-x divide-neutral-500">
      {cells.map((cell, i) => {
        return <Cell key={i} x={_x + i} y={_y} cell={cell} />;
      })}
    </div>
  );
}

function Cell({ x, y, cell }: { x: number; y: number; cell: types.Cell }) {
  const isMatch = cell[0] === cell[1];
  return (
    <div
      className="cell box-content flex size-[calc(var(--cell-size)-var(--spacing)*2)] cursor-pointer items-center justify-center bg-white p-1 dark:bg-neutral-800"
      data-x={x}
      data-y={y}
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
            return null;
        }
      })()}
    </div>
  );
}

function buttonToValue(button: number): -1 | types.Cell[1] {
  switch (button) {
    case 0:
      return 1;
    case 2:
      return 0;
    default:
      return -1;
  }
}

import { useRef } from 'react';

import type { Cell } from 'types';
import { cn } from 'lib/helpers';
import { useGridState } from 'lib/grid';

export default function Board() {
  const { grid, generate, paint } = useGridState((state) => ({
    grid: state.grid,
    generate: state.generate,
    paint(clientX: number, clientY: number, v: -1 | Cell[1]) {
      if (v === -1) return;
      const el = document.elementsFromPoint(clientX, clientY).find((el) => el.classList.contains('cell'));
      if (!el) return;
      state.paint(parseInt(el.getAttribute('data-x')!), parseInt(el.getAttribute('data-y')!), v);
    },
  }));
  const isComplete = grid.every((cells) => cells.every((cell) => cell[0] === cell[1]));

  const isDraggingRef = useRef(false);
  const buttonRef = useRef(-1);

  return (
    <div className="relative border-2 border-neutral-500" onContextMenu={(e) => e.preventDefault()}>
      <div
        className="grid size-full grid-rows-[repeat(var(--height),var(--cell-size))] gap-px"
        onPointerDown={(e) => {
          if (!(e.button === 0 || e.button === 2)) return;
          isDraggingRef.current = true;
          buttonRef.current = e.button;
          paint(e.clientX, e.clientY, buttonToValue(e.button));
        }}
        onPointerUp={() => {
          if (!isDraggingRef.current) return;
          isDraggingRef.current = false;
          buttonRef.current = -1;
        }}
        onPointerLeave={() => {
          if (!isDraggingRef.current) return;
          isDraggingRef.current = false;
          buttonRef.current = -1;
        }}
        onPointerMove={(e) => {
          if (!isDraggingRef.current || buttonRef.current === -1) return;
          paint(e.clientX, e.clientY, buttonToValue(buttonRef.current));
        }}
      >
        {grid.map((cells, y) => (
          <div key={y} className="grid grid-cols-[repeat(var(--width),var(--cell-size))] gap-px">
            {cells.map((cell, x) => {
              const isMatch = cell[0] === cell[1];
              return (
                <div
                  key={x}
                  className="cell flex cursor-pointer items-center justify-center bg-white p-1 dark:bg-neutral-800"
                  data-x={x}
                  data-y={y}
                >
                  {cell.length === 2 ? (
                    cell[1] ? (
                      <div
                        className={cn('size-full rounded', isMatch ? 'bg-black dark:bg-neutral-300' : 'bg-red-500')}
                      />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 384 512"
                        className={cn('aspect-square', !isMatch && 'text-red-500')}
                      >
                        <path
                          d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
                          fill="currentColor"
                        />
                      </svg>
                    )
                  ) : null}
                </div>
              );
            })}
          </div>
        ))}
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

function buttonToValue(button: number): -1 | Cell[1] {
  switch (button) {
    case 0:
      return 1;
    case 2:
      return 0;
    default:
      return -1;
  }
}

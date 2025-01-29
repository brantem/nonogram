import { useRef } from 'react';

import { useGridState } from 'lib/grid';

export default function Board() {
  const { grid, generate, paint } = useGridState((state) => ({
    grid: state.grid,
    generate: state.generate,
    paint(clientX: number, clientY: number) {
      const el = document.elementFromPoint(clientX, clientY);
      if (!el?.classList.contains('cell')) return;
      state.paint(parseInt(el.getAttribute('data-x')!), parseInt(el.getAttribute('data-y')!));
    },
  }));
  const isComplete = grid.every((cells) => cells.every((cell) => cell.length == 2));

  const isDragging = useRef(false);

  return (
    <div className="relative col-span-3 row-span-3">
      <div
        className="grid aspect-square size-full grid-rows-5 divide-y divide-neutral-500 rounded-md border-3 border-neutral-500 bg-white dark:bg-neutral-800"
        onPointerDown={(e) => {
          if (e.button !== 0) return;
          isDragging.current = true;
          paint(e.clientX, e.clientY);
        }}
        onPointerUp={() => {
          if (!isDragging.current) return;
          isDragging.current = false;
        }}
        onPointerLeave={() => {
          if (!isDragging.current) return;
          isDragging.current = false;
        }}
        onPointerMove={(e) => {
          if (!isDragging.current) return;
          paint(e.clientX, e.clientY);
        }}
      >
        {grid.map((cells, y) => (
          <div key={y} className="grid grid-cols-5 divide-x divide-neutral-500">
            {cells.map((cell, x) => {
              if (!cell[1]) return <div key={x} className="cell cursor-pointer" data-x={x} data-y={y} />;
              return cell[0] === cell[1] ? (
                <div key={x} className="p-1.5">
                  <div className="size-full rounded bg-black dark:bg-white" />
                </div>
              ) : (
                <div key={x} className="p-1.5">
                  <div className="flex size-full items-center justify-center text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="aspect-square">
                      <path
                        d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
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

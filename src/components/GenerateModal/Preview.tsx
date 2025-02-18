import { useRef, useEffect } from 'react';
import { useSnapshot } from 'valtio';

import * as shared from './shared';
import { cn } from 'lib/helpers';

export default function Preview({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const state = useSnapshot(shared.state);

  useEffect(() => {
    const grid = state.grid;
    if (!grid.length) return;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const rows = grid.length;
    const cols = grid[0].length;
    const cellSize = canvas.height / Math.max(rows, cols);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw filled
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (grid[i][j][0] === 1) {
          const x = j * cellSize;
          const y = i * cellSize;
          ctx.fillStyle = 'black';
          ctx.fillRect(x, y, cellSize, cellSize);
        }
      }
    }

    // draw the 5x5 groups
    for (let groupRow = 0; groupRow < Math.ceil(rows / 5); groupRow++) {
      for (let groupCol = 0; groupCol < Math.ceil(cols / 5); groupCol++) {
        const groupX = groupCol * 5 * cellSize;
        const groupY = groupRow * 5 * cellSize;
        const groupWidth = Math.min(5, cols - groupCol * 5) * cellSize;
        const groupHeight = Math.min(5, rows - groupRow * 5) * cellSize;

        // group border
        ctx.strokeStyle = '#737373';
        ctx.lineWidth = 2;
        ctx.strokeRect(groupX, groupY, groupWidth, groupHeight);

        for (let i = 0; i < 5; i++) {
          for (let j = 0; j < 5; j++) {
            const cellRow = groupRow * 5 + i;
            const cellCol = groupCol * 5 + j;

            if (cellRow < rows && cellCol < cols) {
              const x = cellCol * cellSize;
              const y = cellRow * cellSize;

              // cell border
              ctx.strokeStyle = '#737373';
              ctx.lineWidth = 1;
              ctx.strokeRect(x, y, cellSize, cellSize);
            }
          }
        }
      }
    }

    // outer border
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;

    // adjust the coordinates to account for the 2px border
    ctx.strokeRect(1, 1, cols * cellSize - 2, rows * cellSize - 2);
  }, [state.grid]);

  return (
    <div className={cn('relative aspect-square', className)}>
      {state.isGenerating && (
        <div className="absolute top-2 left-1/2 z-10 -translate-x-1/2 rounded-md border border-yellow-200 bg-yellow-100 px-3 py-1 text-sm text-yellow-900">
          Generating...
        </div>
      )}
      <div className="absolute inset-0 flex items-center justify-center text-sm text-neutral-500">
        The generated grid will be shown here
      </div>
      <canvas ref={canvasRef} className="relative size-full dark:invert" />
    </div>
  );
}

import { useRef, useState, useEffect, useImperativeHandle } from 'react';
import { useSnapshot } from 'valtio';
import { PhotoIcon } from '@heroicons/react/24/solid';

import Worker from './worker?worker';

import type { Options } from './types';
import { cn } from 'lib/helpers';
import { useDebounce } from 'lib/hooks';
import * as shared from '../shared';

type FileWithPreview = File & {
  preview: string;
};

type ImageProps = {
  ref: React.RefObject<shared.Handle | null>;
};

export default function Image({ ref }: ImageProps) {
  const workerRef = useRef<Worker>(null);

  const state = useSnapshot(shared.state);
  const isGenerating = useDebounce(state.isGenerating, 150);

  const [file, setFile] = useState<FileWithPreview | null>(null);
  const [options, setOptions] = useState<Options>({ threshold: 128, fit: 'cover', invert: false, smoothness: 0 });

  const debouncedOptions = useDebounce(options, 200);
  useEffect(() => {
    if (!file) return;

    shared.state.isGenerating = true;

    const worker = new Worker();
    workerRef.current = worker;

    worker.postMessage({ file, width: shared.state.width, height: shared.state.height, options: debouncedOptions });

    worker.onmessage = async (e) => {
      const { status, ...message } = e.data;
      switch (status) {
        case 'success':
          shared.state.grid.splice(0);
          Object.assign(shared.state.grid, message.data);
          break;
        default:
          // TODO
          console.log({ status, ...message });
      }
      shared.state.isGenerating = false;
    };
    worker.onerror = (err) => {
      // TODO
      console.error('error:', err);
      shared.state.isGenerating = false;
    };
  }, [file, debouncedOptions]);

  useImperativeHandle(ref, () => ({
    generate() {
      workerRef.current?.postMessage({
        file,
        width: shared.state.width,
        height: shared.state.height,
        options,
      });
    },
  }));

  return (
    <>
      <div
        className={cn(
          'sticky top-0 grid divide-neutral-200 bg-neutral-50 max-md:divide-y md:grid-cols-4 md:divide-x',
          'dark:divide-neutral-800 dark:bg-neutral-950',
        )}
      >
        <div className="flex items-center justify-between gap-2 p-2 pl-3 text-sm text-neutral-500">
          <span>Brightness</span>
          <input
            className="flex-1 disabled:opacity-50 max-md:max-w-1/2"
            type="range"
            min="0"
            max="255"
            step="1"
            value={options.threshold}
            onChange={(e) => setOptions((prev) => ({ ...prev, threshold: parseInt(e.target.value) }))}
            disabled={!file || isGenerating}
          />
        </div>
        <div className="flex items-center justify-between gap-2 pl-3 text-sm text-neutral-500">
          <span className="py-2">Image Fit</span>
          <select
            className="h-full border-0 bg-transparent py-0 text-right text-sm focus:outline-none disabled:opacity-50"
            value={options.fit}
            onChange={(e) => setOptions((prev) => ({ ...prev, fit: e.target.value as Options['fit'] }))}
            disabled={!file || isGenerating}
          >
            <option value="cover">Cover</option>
            <option value="contain">Contain</option>
          </select>
        </div>
        <label className="flex items-center justify-between gap-2 px-3 py-2 text-sm text-neutral-500">
          <span>Invert</span>
          <input
            type="checkbox"
            className="rounded disabled:opacity-50"
            checked={options.invert}
            onChange={(e) => setOptions((prev) => ({ ...prev, invert: e.target.checked }))}
            disabled={!file || isGenerating}
          />
        </label>
        <div className="flex items-center justify-between gap-2 pl-3 text-sm text-neutral-500">
          <span className="py-2">Smoothness</span>
          <select
            className="h-full rounded-tr-md border-0 bg-transparent py-0 text-right text-sm disabled:opacity-50"
            value={options.smoothness}
            onChange={(e) =>
              setOptions((prev) => ({ ...prev, smoothness: parseInt(e.target.value) as Options['smoothness'] }))
            }
            disabled={!file || isGenerating}
          >
            <option value="0">None</option>
            <option value="1">Low</option>
            <option value="2">High</option>
          </select>
        </div>
      </div>

      <div
        className={cn(
          'grid divide-x divide-neutral-200 max-md:divide-y md:grid-cols-[repeat(2,500px)]',
          'dark:divide-neutral-800',
        )}
      >
        <label className="flex aspect-square size-full items-center justify-center">
          {/* TODO: drop image */}
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              if (!e.target.files || !e.target.files.length) return;
              const file = e.target.files[0];
              setFile((prev) => {
                if (prev) URL.revokeObjectURL(prev.preview);
                return Object.assign(file, { preview: URL.createObjectURL(file) });
              });
            }}
            disabled={state.isGenerating || isGenerating}
          />
          {file ? (
            <img
              src={file.preview}
              className="size-full object-cover"
              onLoad={() => URL.revokeObjectURL(file.preview)}
            />
          ) : (
            <PhotoIcon className="size-16 text-neutral-500" />
          )}
        </label>

        <Preview />
      </div>
    </>
  );
}

function Preview() {
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
    <div className="relative aspect-square">
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

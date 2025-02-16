import { useRef, useState, useImperativeHandle, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/solid';

import WidthHeightInput from 'components/WidthHeightInput';

import type * as types from 'types';
import type { Options } from './types';
import * as nonogram from 'lib/state/nonogram';
import Worker from './worker?worker';
import { useDebounce } from 'lib/hooks';
import * as constants from 'constants';
import { cn } from 'lib/helpers';

export type GenerateFromImageModalHandle = {
  open(): void;
};

type FileWithPreview = File & {
  preview: string;
};

type Data = {
  width: number;
  height: number;
  options: Options;
};

const generateDefaultData = (): Data => ({
  width: nonogram.settings.width,
  height: nonogram.settings.height,
  options: {
    threshold: 128,
    fit: 'cover',
    invert: false,
    smoothness: 0,
  },
});

export default function GenerateFromImageModal({ ref }: { ref: React.Ref<GenerateFromImageModalHandle> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<FileWithPreview | null>(null);
  const [data, setData] = useState<Data>(generateDefaultData);
  const [isGenerating, setIsGenerating] = useState(false);
  const [grid, setGrid] = useState<types.Cell[][]>([]);
  const debouncedIsGenerating = useDebounce(isGenerating, 150);

  useImperativeHandle(ref, () => ({
    open() {
      setData(generateDefaultData()); // to make sure data has the most updated values for width and height
      setIsOpen(true);
    },
  }));

  const debouncedData = useDebounce(data, 200);
  useEffect(() => {
    if (!file) return;

    if (debouncedData.width < constants.width.min || debouncedData.width > constants.width.max) return;
    if (debouncedData.height < constants.height.min || debouncedData.height > constants.height.max) return;

    setIsGenerating(true);

    const worker = new Worker();
    worker.postMessage({ file, ...debouncedData });

    worker.onmessage = async (e) => {
      const { status, ...message } = e.data;
      switch (status) {
        case 'success':
          preview(message.data);
          setGrid(message.data);
          break;
        default:
          // TODO
          console.log({ status, ...message });
      }
      setIsGenerating(false);
    };
    worker.onerror = (err) => {
      // TODO
      console.error('error:', err);
      setIsGenerating(false);
    };
  }, [file, debouncedData]);

  const preview = (grid: types.Cell[][]) => {
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
  };

  const closeAndReset = () => {
    setIsOpen(false);

    if (!file) return;
    URL.revokeObjectURL(file.preview);
    setFile(null);

    setData(generateDefaultData);
    setIsGenerating(false);
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (open) return;
        closeAndReset();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className={cn('fixed inset-0 z-20 bg-white/50 backdrop-blur-xs', 'dark:bg-black/50')} />
        <Dialog.Content
          className={cn(
            'fixed z-30 max-w-full divide-y divide-neutral-200 overflow-auto border-neutral-200 bg-white shadow-xl focus:outline-none max-md:inset-0 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-md md:border',
            'dark:divide-neutral-800 dark:border-neutral-800 dark:bg-black dark:text-white',
          )}
          onEscapeKeyDown={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
          <div className={cn('flex items-center justify-between gap-2 bg-neutral-50 px-3 py-2', 'dark:bg-neutral-950')}>
            <div className="flex items-center gap-2">
              <Dialog.Close
                className={cn(
                  '-ml-1 aspect-square h-full rounded border border-neutral-200 p-1 hover:bg-white',
                  'dark:border-neutral-800 dark:hover:bg-neutral-900',
                )}
              >
                <XMarkIcon className="size-5" />
              </Dialog.Close>
              <Dialog.Title>Generate</Dialog.Title>
            </div>

            <div className="flex gap-2">
              <WidthHeightInput
                width={{
                  value: data.width,
                  onChange(width) {
                    setData((prev) => ({ ...prev, width }));
                  },
                }}
                height={{
                  value: data.height,
                  onChange(height) {
                    setData((prev) => ({ ...prev, height }));
                  },
                }}
                disabled={!file || debouncedIsGenerating}
              />

              <button
                className={cn(
                  'rounded-md border border-neutral-800 bg-neutral-950 px-3 py-1 text-sm text-white hover:bg-neutral-900',
                  'dark:border-neutral-200 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100',
                )}
                onClick={() => {
                  nonogram.settings.width = data.width;
                  nonogram.settings.height = data.height;

                  nonogram.grid.splice(0);
                  Object.assign(nonogram.grid, grid);

                  closeAndReset();
                }}
              >
                Save
              </button>
            </div>
          </div>

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
                value={data.options.threshold}
                onChange={(e) => {
                  setData((prev) => ({ ...prev, options: { ...prev.options, threshold: parseInt(e.target.value) } }));
                }}
                disabled={!file || debouncedIsGenerating}
              />
            </div>
            <div className="flex items-center justify-between gap-2 pl-3 text-sm text-neutral-500">
              <span className="py-2">Image Fit</span>
              <select
                className="h-full border-0 bg-transparent py-0 text-right text-sm focus:outline-none disabled:opacity-50"
                value={data.options.fit}
                onChange={(e) => {
                  setData((prev) => ({ ...prev, options: { ...prev.options, fit: e.target.value as Options['fit'] } }));
                }}
                disabled={!file || debouncedIsGenerating}
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
                checked={data.options.invert}
                onChange={(e) => {
                  setData((prev) => ({ ...prev, options: { ...prev.options, invert: e.target.checked } }));
                }}
                disabled={!file || debouncedIsGenerating}
              />
            </label>
            <div className="flex items-center justify-between gap-2 pl-3 text-sm text-neutral-500">
              <span className="py-2">Smoothness</span>
              <select
                className="h-full rounded-tr-md border-0 bg-transparent py-0 text-right text-sm disabled:opacity-50"
                value={data.options.smoothness}
                onChange={(e) => {
                  setData((prev) => ({
                    ...prev,
                    options: { ...prev.options, smoothness: parseInt(e.target.value) as Options['smoothness'] },
                  }));
                }}
                disabled={!file || debouncedIsGenerating}
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
              />
              {file ? (
                <img src={file.preview} className="size-full object-cover" />
              ) : (
                <PhotoIcon className="size-16 text-neutral-500" />
              )}
            </label>

            <div className="relative aspect-square">
              {debouncedIsGenerating && (
                <div
                  className={cn(
                    'absolute top-2 left-1/2 -translate-x-1/2 rounded-md border border-neutral-200 bg-white px-3 py-1 text-sm',
                    'dark:border-neutral-800',
                  )}
                >
                  Generating...
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center text-sm text-neutral-500">
                The generated grid will be shown here
              </div>
              <canvas ref={canvasRef} className="relative size-full dark:invert" />
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

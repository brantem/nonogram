import { useRef, useState, useEffect, useImperativeHandle } from 'react';
import { useSnapshot } from 'valtio';
import { PhotoIcon } from '@heroicons/react/24/solid';

import Preview from '../Preview';
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

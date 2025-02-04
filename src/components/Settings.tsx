import { useEffect, useState } from 'react';

import * as nonogram from 'lib/nonogram';
import { useDebounce } from 'lib/hooks';
import { cn } from 'lib/helpers';

export default function Sidebar() {
  const [settings, setSettings] = useState(() => nonogram.settings);

  return (
    <div className="flex border-b border-neutral-200 bg-neutral-100 text-sm max-md:flex-col md:gap-2 md:px-2">
      <div className="flex gap-2 p-2 max-md:flex-col md:gap-6">
        <div className="flex gap-4">
          <label className="flex items-center justify-between gap-2 max-md:flex-1">
            <span className="text-neutral-500 max-md:w-11">Width</span>
            <input
              type="number"
              value={settings.width}
              onChange={(e) => setSettings((prev) => ({ ...prev, width: parseInt(e.target.value) }))}
              className="w-24 rounded-md border-neutral-200 px-2 py-1 text-right tabular-nums max-md:flex-1"
            />
          </label>

          <label className="flex items-center justify-between gap-2 max-md:flex-1">
            <span className="text-neutral-500 max-md:w-11">Height</span>
            <input
              type="number"
              value={settings.height}
              onChange={(e) => setSettings((prev) => ({ ...prev, height: parseInt(e.target.value) }))}
              className="w-24 rounded-md border-neutral-200 px-2 py-1 text-right tabular-nums max-md:flex-1"
            />
          </label>
        </div>

        <button
          type="reset"
          className="rounded-md bg-neutral-900 px-3 py-1 font-medium text-white hover:bg-neutral-800 max-md:h-10"
          onClick={() => {
            Object.assign(nonogram.settings, settings);
            nonogram.generate();
          }}
        >
          New Board
        </button>

        {/* TODO: save and load buttons */}
      </div>

      <div className="h-px w-full bg-neutral-200 md:h-full md:w-px" />

      <Size />
    </div>
  );
}

// TODO: zoom buttons
function Size() {
  const [value, setValue] = useState(() => nonogram.settings.cell.size.toString());

  const size = useDebounce(parseInt(value), 500);
  const isInvalid = isNaN(size) || size < 16 || size > 64;

  useEffect(() => {
    if (isInvalid) return;
    nonogram.settings.cell.size = size;
  }, [size]);

  return (
    <div className="p-2">
      <label className="flex items-center justify-between gap-2">
        <span className="text-neutral-500 max-md:w-11">Size</span>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          min="16"
          max="64"
          className={cn(
            'w-[calc(50%-44px-16px)] rounded-md border-neutral-200 px-2 py-1 text-right tabular-nums !outline-none md:w-24',
            isInvalid && 'border-red-300 ring-red-600 focus:border-red-600 focus:ring',
          )}
        />
      </label>
    </div>
  );
}

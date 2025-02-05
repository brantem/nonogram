import { useState } from 'react';
import { useSnapshot } from 'valtio';

import { cn } from 'lib/helpers';
import * as nonogram from 'lib/state/nonogram';

export default function Settings() {
  return (
    <Container>
      <Grid />

      <div className="h-px w-full bg-neutral-200 md:hidden dark:bg-neutral-800" />

      <Cell />
    </Container>
  );
}

function Container({ children }: React.PropsWithChildren) {
  const isVisible = useSnapshot(nonogram.settings).isVisible;

  return (
    <div
      className={cn(
        'relative flex justify-between border-b border-neutral-200 bg-neutral-100 text-sm max-md:flex-col md:items-center dark:border-neutral-800 dark:bg-neutral-900',
        !isVisible && 'max-md:-mt-23',
      )}
    >
      {children}

      <button
        className={cn(
          'absolute left-1/2 z-20 flex h-8 -translate-x-1/2 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 px-3 text-sm md:hidden',
          isVisible ? '-bottom-4' : '-bottom-10',
        )}
        onClick={() => (nonogram.settings.isVisible = !nonogram.settings.isVisible)}
      >
        Settings
      </button>
    </div>
  );
}

const data = {
  width: {
    min: 3,
    max: 50,
  },
  height: {
    min: 3,
    max: 50,
  },
  cell: {
    size: {
      step: 4,
      min: 16,
      max: 128,
    },
  },
};

function Grid() {
  const [settings, setSettings] = useState(() => ({
    width: nonogram.settings.width,
    height: nonogram.settings.height,
  }));

  return (
    <form
      className="flex items-stretch justify-between gap-2 p-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (settings.width < data.width.min || settings.width > data.width.max) return;
        if (settings.height < data.height.min || settings.height > data.height.max) return;
        nonogram.settings.width = settings.width;
        nonogram.settings.height = settings.height;
        nonogram.generate();
      }}
    >
      <div className="flex items-center gap-2">
        <div className="flex w-fit items-center">
          <Input
            type="number"
            value={settings.width}
            min={data.width.min}
            max={data.width.max}
            onChange={(e) => setSettings((prev) => ({ ...prev, width: parseInt(e.target.value) }))}
          />

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="size-4 shrink-0 text-neutral-500"
          >
            <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
          </svg>

          <Input
            type="number"
            value={settings.height}
            min={data.height.min}
            max={data.height.max}
            onChange={(e) => setSettings((prev) => ({ ...prev, height: parseInt(e.target.value) }))}
          />
        </div>
      </div>

      {/* TODO: delay before the next generate */}
      <button
        type="submit"
        className="shrink-0 rounded-md border border-neutral-600 bg-neutral-900 px-3 py-1 font-medium text-white hover:bg-neutral-800 dark:border-neutral-800 dark:bg-neutral-700 dark:hover:bg-neutral-600"
      >
        Generate
      </button>

      {/* TODO: save and load buttons */}
    </form>
  );
}

function Input(props: Omit<React.ComponentPropsWithoutRef<'input'>, 'className'>) {
  return (
    <input
      {...props}
      className="w-12 rounded-md border-neutral-200 px-2 py-1 text-center text-sm tabular-nums invalid:border-red-500 invalid:ring-red-600 invalid:focus:border-red-600 invalid:focus:ring max-md:flex-1 dark:border-neutral-800 dark:bg-black"
    />
  );
}

function Cell() {
  const cell = useSnapshot(nonogram.settings.cell);

  return (
    <div className="flex items-center justify-between gap-2 p-2">
      <span className="text-neutral-500">{cell.size}px</span>

      <div className="flex gap-1">
        <ZoomButton
          onClick={() => (nonogram.settings.cell.size -= data.cell.size.step)}
          disabled={cell.size === data.cell.size.min}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
            <path
              fillRule="evenodd"
              d="M4 10a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H4.75A.75.75 0 0 1 4 10Z"
              clipRule="evenodd"
            />
          </svg>
        </ZoomButton>
        <ZoomButton
          onClick={() => (nonogram.settings.cell.size += data.cell.size.step)}
          disabled={cell.size === data.cell.size.max}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
            <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
          </svg>
        </ZoomButton>
      </div>
    </div>
  );
}

function ZoomButton(props: Omit<React.ComponentPropsWithoutRef<'button'>, 'className'>) {
  return (
    <button
      {...props}
      className="flex items-center justify-center rounded-md border border-neutral-300 p-1 hover:border-neutral-200 hover:bg-white dark:border-neutral-800 dark:hover:border-neutral-700 dark:hover:bg-neutral-800"
    />
  );
}

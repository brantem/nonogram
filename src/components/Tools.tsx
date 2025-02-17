import { useRef, useState } from 'react';
import { useSnapshot } from 'valtio';
import {
  ChevronUpIcon,
  ChevronDownIcon,
  MinusIcon,
  PlusIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
} from '@heroicons/react/16/solid';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import WidthHeightInput from './WidthHeightInput';
import GenerateFromImageModal, { GenerateFromImageModalHandle } from './GenerateFromImageModal';

import { cn } from 'lib/helpers';
import * as theme from 'lib/state/theme';
import * as nonogram from 'lib/state/nonogram';
import * as constants from 'constants';

export default function Tools() {
  return (
    <Container>
      <div className="flex items-stretch gap-2 p-2">
        {/* TODO: button to see all ssaved grids */}
        <Grid />
        <Separator />
        <button
          className={cn(
            'rounded-md border border-red-200 bg-red-50 px-3 py-1 text-red-500 hover:bg-red-100 focus:z-10',
            'dark:border-red-800 dark:bg-red-950 dark:hover:bg-red-900',
          )}
          onClick={nonogram.reset}
        >
          Reset
        </button>
        {/* TODO: button to save grid */}
      </div>

      <div className={cn('h-px w-full bg-neutral-200 md:hidden', 'dark:bg-neutral-800')} />

      <div className="flex items-stretch justify-between gap-2 p-2">
        <Cell />
        <Separator />
        <Theme />
      </div>
    </Container>
  );
}

function Container({ children }: React.PropsWithChildren) {
  const isVisible = useSnapshot(nonogram.settings).isVisible;

  return (
    <div
      className={cn(
        'relative flex justify-between border-b border-neutral-200 bg-neutral-50 text-sm max-md:flex-col md:items-center',
        'dark:border-neutral-800 dark:bg-neutral-950 dark:text-white',
        !isVisible && 'max-md:-mt-[98px] md:-mt-[49px]',
      )}
    >
      {children}

      <button
        className={cn(
          'absolute left-1/2 z-20 flex h-8 -translate-x-1/2 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 text-sm',
          'dark:border-neutral-800 dark:bg-neutral-950',
          isVisible ? '-bottom-4 aspect-square' : '-bottom-10 px-3',
        )}
        onClick={() => (nonogram.settings.isVisible = !nonogram.settings.isVisible)}
      >
        {isVisible ? <ChevronUpIcon className="size-5" /> : 'Tools'}
      </button>
    </div>
  );
}

function Grid() {
  const generateFromImageModalRef = useRef<GenerateFromImageModalHandle>(null);

  const [settings, setSettings] = useState(() => ({
    width: nonogram.settings.width,
    height: nonogram.settings.height,
  }));

  return (
    <>
      <form
        className="flex flex-1 items-stretch justify-between gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          if (settings.width < constants.width.min || settings.width > constants.width.max) return;
          if (settings.height < constants.height.min || settings.height > constants.height.max) return;
          nonogram.settings.width = settings.width;
          nonogram.settings.height = settings.height;
          nonogram.generate();
        }}
      >
        <WidthHeightInput
          width={{
            value: settings.width,
            onChange(width) {
              setSettings((prev) => ({ ...prev, width }));
            },
          }}
          height={{
            value: settings.height,
            onChange(height) {
              setSettings((prev) => ({ ...prev, height }));
            },
          }}
        />

        <div className="flex font-medium text-white">
          {/* TODO: delay before the next generate */}
          <button
            type="submit"
            className={cn(
              'rounded-l-md border border-sky-300 bg-sky-500 px-3 py-1 hover:bg-sky-400 focus:z-10',
              'dark:border-sky-800 dark:bg-sky-600 dark:hover:bg-sky-700',
            )}
          >
            New
          </button>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                type="button"
                className={cn(
                  '-ml-px flex size-8 items-center justify-center rounded-r-md border border-sky-300 bg-sky-500 hover:bg-sky-400',
                  'dark:border-sky-800 dark:bg-sky-600 dark:hover:bg-sky-700',
                )}
              >
                <ChevronDownIcon className="size-4" />
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className={cn(
                  'mt-1 w-[150px] rounded-md border border-neutral-200 bg-white p-0.5 text-sm shadow-xs',
                  'dark:border-neutral-800 dark:bg-neutral-950 dark:text-white',
                )}
                side="bottom"
                align="end"
              >
                <DropdownMenu.Item
                  className={cn(
                    'flex h-8 items-center rounded px-3 outline-none select-none hover:bg-neutral-100',
                    'dark:hover:bg-neutral-900',
                  )}
                  onClick={() => generateFromImageModalRef.current?.open()}
                >
                  From Image
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </form>

      <GenerateFromImageModal ref={generateFromImageModalRef} />
    </>
  );
}

function Cell() {
  const cell = useSnapshot(nonogram.settings.cell);

  return (
    <div className="flex items-center justify-between gap-2 max-md:flex-1">
      <span className="text-neutral-500">{cell.size}px</span>

      <div className="flex gap-1">
        <Button
          className="size-8"
          onClick={() => (nonogram.settings.cell.size -= constants.cell.size.step)}
          disabled={cell.size === constants.cell.size.min}
        >
          <MinusIcon className="size-5" />
        </Button>
        <Button
          className="size-8"
          onClick={() => (nonogram.settings.cell.size += constants.cell.size.step)}
          disabled={cell.size === constants.cell.size.max}
        >
          <PlusIcon className="size-5" />
        </Button>
      </div>
    </div>
  );
}

function Theme() {
  const value = useSnapshot(theme.data).value;

  return (
    <Button className="size-8 p-1.5" onClick={theme.toggle}>
      {(() => {
        switch (value) {
          case 'light':
            return <SunIcon className="size-4" />;
          case 'dark':
            return <MoonIcon className="size-4" />;
          default:
            return <ComputerDesktopIcon className="size-4" />;
        }
      })()}
    </Button>
  );
}

function Separator({ className }: Pick<React.ComponentPropsWithoutRef<'div'>, 'className'>) {
  return <div className={cn('-my-2 w-px bg-neutral-200', 'dark:bg-neutral-800', className)} />;
}

function Button({ className, ...props }: React.ComponentPropsWithoutRef<'button'>) {
  return (
    <button
      {...props}
      className={cn(
        'flex items-center justify-center rounded-md border border-neutral-200 hover:bg-white',
        'dark:border-neutral-800 dark:hover:bg-neutral-900',
        className,
      )}
    />
  );
}

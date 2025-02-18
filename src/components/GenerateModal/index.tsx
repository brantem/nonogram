import { useRef, useState, useImperativeHandle } from 'react';
import { useSnapshot } from 'valtio';
import * as Dialog from '@radix-ui/react-dialog';
import { XMarkIcon } from '@heroicons/react/24/solid';

import SizeInput from 'components/SizeInput';
import Image from './Image';

import * as constants from 'constants';
import { cn } from 'lib/helpers';
import * as nonogram from 'lib/state/nonogram';
import * as shared from './shared';

export type GenerateModalHandle = {
  open(): void;
};

export default function GenerateModal({ ref }: { ref: React.Ref<GenerateModalHandle> }) {
  const state = useSnapshot(shared.state);

  const imageRef = useRef<shared.Handle>(null);

  const [isOpen, setIsOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    open() {
      setIsOpen(true);
    },
  }));

  const closeAndReset = () => {
    setIsOpen(false);
    shared.state.grid.splice(0);
    shared.state.isGenerating = false;
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
              <SizeInput
                value={{
                  width: state.width,
                  height: state.height,
                }}
                onChange={(values) => {
                  shared.state.width = values.width;
                  shared.state.height = values.height;

                  if (values.width < constants.width.min || values.width > constants.width.max) return;
                  if (values.height < constants.height.min || values.height > constants.height.max) return;
                  // TODO: debounce
                  imageRef.current?.generate();
                }}
                disabled={state.isGenerating}
              />

              <button
                className={cn(
                  'rounded-md border border-sky-300 bg-sky-500 px-3 py-1 text-sm text-white hover:bg-sky-400 focus:z-10',
                  'dark:border-sky-800 dark:bg-sky-600 dark:hover:bg-sky-700',
                )}
                onClick={() => {
                  nonogram.grid.splice(0);
                  Object.assign(nonogram.grid, shared.state.grid);

                  closeAndReset();
                }}
              >
                Save
              </button>
            </div>
          </div>

          <Image ref={imageRef} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

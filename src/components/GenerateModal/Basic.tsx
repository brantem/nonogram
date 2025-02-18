import { useEffect, useImperativeHandle } from 'react';

import Preview from './Preview';

import { cn } from 'lib/helpers';
import * as nonogram from 'lib/state/nonogram';
import * as shared from './shared';

type BasicProps = {
  ref: React.RefObject<shared.Handle | null>;
};

// FIXME: If the current size is 50x50, generating a new board with a size of 5x5 will cause an error:
// "Uncaught TypeError: Cannot read properties of undefined (reading '0')" in Grid.tsx:141

export default function Basic({ ref }: BasicProps) {
  const generate = () => {
    shared.state.grid.splice(0);
    Object.assign(shared.state.grid, nonogram.generate(shared.state.width, shared.state.height));
  };

  useImperativeHandle(ref, () => ({ generate }));

  useEffect(generate, []);

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex w-full flex-1 items-center justify-center">
        <Preview className="w-full md:size-[500px]" />
      </div>

      <div
        className={cn(
          'flex justify-center border-t border-neutral-200 bg-neutral-50 p-3',
          'dark:border-neutral-800 dark:bg-black dark:text-white',
        )}
      >
        <button
          className={cn(
            'rounded-md border border-sky-300 bg-sky-500 px-3 py-1 text-sm text-white hover:bg-sky-400 focus:z-10',
            'dark:border-sky-800 dark:bg-sky-600 dark:hover:bg-sky-700',
          )}
          onClick={generate}
        >
          Generate
        </button>
      </div>
    </div>
  );
}

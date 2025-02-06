import XMarkIcon from './icons/XMarkIcon';

import type * as types from 'types';
import { cn } from 'lib/helpers';

export default function Hint({ hint }: { hint: types.Hint }) {
  return (
    <div
      className={cn(
        'box-content size-(--cell-size)',
        hint[0]
          ? 'flex items-center justify-center bg-neutral-200 group-[.is-active]:bg-white dark:bg-neutral-800 dark:group-[.is-active]:bg-neutral-600'
          : 'bg-neutral-100 dark:bg-neutral-900',
        hint[1] && 'relative overflow-hidden',
      )}
    >
      {hint[0] ? <span>{hint[0]}</span> : null}
      {hint[1] ? <XMarkIcon className="absolute -inset-1 aspect-square" /> : null}
    </div>
  );
}

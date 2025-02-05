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
        hint[1] && 'relative',
      )}
    >
      {hint[0] ? <span>{hint[0]}</span> : null}
      {hint[1] ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={3}
          stroke="currentColor"
          className="absolute inset-0 aspect-square"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      ) : null}
    </div>
  );
}

import type * as types from 'types';
import { cn } from 'lib/helpers';

export default function Hint({ hint }: { hint: types.Hint }) {
  return (
    <div
      className={cn(
        'box-content size-(--cell-size)',
        hint[0] ? 'flex items-center justify-center bg-neutral-200' : 'bg-neutral-100',
      )}
    >
      {hint[0] ? <span className={hint[1] ? 'opacity-50' : undefined}>{hint[0]}</span> : null}
    </div>
  );
}

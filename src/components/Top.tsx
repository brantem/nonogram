import { useSnapshot } from 'valtio';

import Hint from './Hint';

import { generateGroups, cn } from 'lib/helpers';
import * as nonogram from 'lib/state/nonogram';
import * as highlight from 'lib/state/highlight';

export default function Top() {
  const size = useSnapshot(nonogram.size);
  const groups = generateGroups(size.width, 5);

  return (
    <div className="flex divide-x-[3px] divide-neutral-500 border-[2px] border-neutral-500">
      {groups.map((group, i) => (
        <div key={i} className="flex divide-x divide-neutral-500">
          {[...new Array(group)].map((_, j) => (
            <Hints key={j} x={i * 5 + j} />
          ))}
        </div>
      ))}
    </div>
  );
}

function Hints({ x }: { x: number }) {
  const hints = useSnapshot(nonogram.hints).top[x];
  const isActive = useSnapshot(highlight.data).x[x];
  return (
    <div className={cn('flex flex-col divide-y divide-neutral-500', isActive && 'group is-active')}>
      {hints.map((hint, i) => (
        <Hint key={i} hint={hint} />
      ))}
    </div>
  );
}

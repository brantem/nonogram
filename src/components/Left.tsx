import { useSnapshot } from 'valtio';

import Hint from './Hint';

import { generateGroups, cn } from 'lib/helpers';
import * as nonogram from 'lib/state/nonogram';
import * as highlight from 'lib/state/highlight';

export default function Left() {
  const settings = useSnapshot(nonogram.settings);
  const groups = generateGroups(settings.height, 5);

  return (
    <div className='flex flex-col divide-y-[3px] divide-neutral-500 border-[2px] border-neutral-500 [&>div>div[data-y="var(--active-y)"]]:!bg-white'>
      {groups.map((group, i) => (
        <div key={i} className="flex flex-col divide-y divide-neutral-500">
          {[...new Array(group)].map((_, j) => {
            const y = i * 5 + j;
            return <Hints key={j} y={y} />;
          })}
        </div>
      ))}
    </div>
  );
}

function Hints({ y }: { y: number }) {
  const hints = useSnapshot(nonogram.hints).left[y];
  const isActive = useSnapshot(highlight.data).coord[y] === 1;
  return (
    <div className={cn('flex divide-x divide-neutral-500', isActive && 'group is-active')}>
      {hints.map((hint, i) => (
        <Hint key={i} hint={hint} />
      ))}
    </div>
  );
}

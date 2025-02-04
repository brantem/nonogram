import { useSnapshot } from 'valtio';

import Hint from './Hint';

import { generateGroups } from 'lib/helpers';
import * as nonogram from 'lib/nonogram';

export default function Top() {
  const settings = useSnapshot(nonogram.settings);
  const groups = generateGroups(settings.width, 5);

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
  return (
    <div className="flex flex-col divide-y divide-neutral-500">
      {hints.map((hint, i) => (
        <Hint key={i} hint={hint} />
      ))}
    </div>
  );
}

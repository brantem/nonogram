import { useEffect } from 'react';

import Top from 'components/Top';
import Left from 'components/Left';
import Board from 'components/Board';

import * as nonogram from 'lib/nonogram';
import * as selection from 'lib/selection';

function App() {
  useEffect(() => {
    document.addEventListener('pointerup', selection.end);
    return () => {
      document.removeEventListener('pointerup', selection.end);
    };
  }, []);

  return (
    <div className="m-auto overflow-x-auto overflow-y-hidden pt-4 pr-9 pb-9 pl-4">
      <div
        className="flex w-fit items-end border-[3px] border-neutral-900 text-(length:--font-size) font-semibold tabular-nums select-none"
        style={
          {
            '--width': nonogram.settings.width,
            '--height': nonogram.settings.height,
            '--cell-size': `${nonogram.settings.cell.size}px`,
            '--font-size': `${(nonogram.settings.cell.size / 3) * 2}px`,
          } as React.CSSProperties
        }
      >
        <div className="flex flex-col justify-end">
          <div className="h-[3px] shrink-0 bg-neutral-900 dark:bg-white" />
          <Left />
        </div>
        <div className="w-[3px] shrink-0 self-stretch bg-neutral-900 dark:bg-white" />
        <div className="flex flex-col">
          <Top />
          <div className="flex-1 shrink-0 border-b-[3px] bg-neutral-50" />
          <Board />
        </div>
      </div>
    </div>
  );
}

export default App;

import { useEffect } from 'react';
import { useSnapshot } from 'valtio';

import Settings from 'components/Settings';
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
    <>
      <Settings />

      <div className="flex flex-1 items-center justify-center overflow-auto">
        <div className="m-auto overflow-x-auto overflow-y-hidden pt-4 pr-9 pb-9 pl-4">
          <Container>
            <div className="flex flex-col justify-end">
              <div className="h-[3px] shrink-0 bg-neutral-900 dark:bg-neutral-700" />
              <Left />
            </div>
            <div className="w-[3px] shrink-0 self-stretch bg-neutral-900 dark:bg-neutral-700" />
            <div className="flex flex-col">
              <Top />
              <div className="h-[3px] w-full bg-neutral-900 dark:bg-neutral-700" />
              <Board />
            </div>
          </Container>
        </div>
      </div>
    </>
  );
}

export default App;

function Container({ children }: React.PropsWithChildren) {
  const settings = useSnapshot(nonogram.settings);

  return (
    <div
      className="flex w-fit items-end rounded border-[3px] border-neutral-900 text-(length:--font-size) font-semibold select-none dark:border-neutral-700"
      style={
        {
          '--width': settings.width,
          '--height': settings.height,
          '--cell-size': `${settings.cell.size}px`,
          '--font-size': `${(settings.cell.size / 3) * 2}px`,
        } as React.CSSProperties
      }
    >
      {children}{' '}
    </div>
  );
}

import { useEffect } from 'react';
import { useSnapshot } from 'valtio';

import Tools from 'components/Tools';
import Top from 'components/Top';
import Left from 'components/Left';
import Grid from 'components/Grid';

import { cn } from 'lib/helpers';
import * as nonogram from 'lib/state/nonogram';
import * as selection from 'lib/state/selection';

function App() {
  useEffect(() => {
    document.addEventListener('pointerup', selection.end);
    return () => {
      document.removeEventListener('pointerup', selection.end);
    };
  }, []);

  return (
    <>
      <Tools />

      <Container>
        <div className="flex flex-col">
          <div
            className={cn('flex-1 border-b-[3px] border-neutral-900 bg-white', 'dark:border-neutral-700 dark:bg-black')}
          />
          <Left />
        </div>
        <div className={cn('w-[3px] shrink-0 self-stretch bg-neutral-900', 'dark:bg-neutral-700')} />
        <div className="flex flex-col">
          <Top />
          <div className={cn('h-[3px] w-full bg-neutral-900', 'dark:bg-neutral-700')} />
          <Grid />
        </div>
      </Container>
    </>
  );
}

export default App;

function Container({ children }: React.PropsWithChildren) {
  const settings = useSnapshot(nonogram.settings);

  return (
    <div className={cn('flex flex-1 items-center justify-center overflow-auto', 'dark:text-white')}>
      <div className={cn('no-scrollbar m-auto overflow-auto pr-9 pb-8 pl-4', settings.isVisible ? 'pt-6' : 'pt-12')}>
        <div
          className={cn(
            'flex w-fit rounded border-[3px] border-neutral-900 text-(length:--font-size) font-semibold select-none',
            'dark:border-neutral-700',
          )}
          style={
            {
              '--width': settings.width,
              '--height': settings.height,
              '--cell-size': `${settings.cell.size}px`,
              '--font-size': `${(settings.cell.size / 3) * 2}px`,
            } as React.CSSProperties
          }
        >
          {children}
        </div>
      </div>
    </div>
  );
}

import { useEffect } from 'react';

import Top from 'components/Top';
import Left from 'components/Left';
import Board from 'components/Board';
import Footer from 'components/Footer';

import { useNonogramState } from 'lib/nonogram';
import { useSelectionState } from 'lib/selection';

function App() {
  const selection = useSelectionState((state) => ({ end: state.end }));
  const nonogram = useNonogramState((state) => ({ width: state.width, height: state.height, size: state.size }));

  useEffect(() => {
    document.addEventListener('pointerup', selection.end);
    return () => {
      document.removeEventListener('pointerup', selection.end);
    };
  }, []);

  return (
    <>
      <div
        className="flex flex-col border-[3px] border-neutral-900 text-center text-2xl font-semibold tabular-nums select-none dark:border-white"
        style={
          {
            '--width': nonogram.width,
            '--height': nonogram.height,
            '--cell-size': `${nonogram.size}px`,
          } as React.CSSProperties
        }
      >
        <div className="flex">
          <div className="flex-1 border-r-[3px] bg-neutral-50" />
          <Top />
        </div>
        <div className="h-[3px] w-full bg-neutral-900 dark:bg-white" />
        <div className="flex items-end">
          <Left />
          <div className="w-[3px] self-stretch bg-neutral-900 dark:bg-white" />
          <Board />
        </div>
      </div>

      <Footer />
    </>
  );
}

export default App;

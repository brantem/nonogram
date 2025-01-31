import Footer from 'compoents/Footer';
import Top from 'compoents/Top';
import Left from 'compoents/Left';
import Board from 'compoents/Board';
import { useNonogramState } from 'lib/nonogram';

// TODO: widht, height, size

function App() {
  const { width, height, size } = useNonogramState((state) => ({
    width: state.width,
    height: state.height,
    size: state.size,
  }));

  return (
    <div className="grid h-full grid-rows-[32px_1fr_32px] gap-y-4 select-none sm:gap-y-8">
      <div />

      <div className="flex items-center justify-center">
        <div
          className="flex flex-col border-[3px] border-neutral-900 text-center text-3xl font-semibold tabular-nums dark:border-white"
          style={{ '--width': width, '--height': height, '--cell-size': `${size}px` } as React.CSSProperties}
        >
          <div className="flex">
            <div className="-mt-[3px] -ml-[3px] flex-1 border-r-[3px] border-neutral-900 bg-neutral-100 dark:border-white dark:bg-black" />
            <Top />
          </div>
          <div className="h-[3px] w-full bg-neutral-900 dark:bg-white" />
          <div className="flex items-end">
            <Left />
            <div className="w-[3px] self-stretch bg-neutral-900 dark:bg-white" />
            <Board />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default App;

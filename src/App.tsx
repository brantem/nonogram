import TopHint from 'compoents/TopHint';
import LeftHint from 'compoents/LeftHint';
import Board from 'compoents/Board';

function App() {
  return (
    <div className="flex h-full flex-col justify-between gap-y-4 select-none sm:gap-y-8">
      <div />

      <div className="grid aspect-square grid-cols-4 grid-rows-4 text-center text-2xl font-semibold tabular-nums md:text-3xl dark:text-white">
        <TopHint />
        <LeftHint />
        <Board />
      </div>

      <div />
    </div>
  );
}

export default App;

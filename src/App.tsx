import Footer from 'compoents/Footer';
import TopHint from 'compoents/TopHint';
import LeftHint from 'compoents/LeftHint';
import Board from 'compoents/Board';

function App() {
  return (
    <div className="grid h-full grid-rows-[32px_1fr_1px] gap-y-4 select-none sm:gap-y-8">
      <div />

      <div className="flex items-center justify-center">
        <div className="grid grid-cols-4 grid-rows-4 text-center text-2xl font-semibold tabular-nums md:text-3xl">
          <TopHint />
          <LeftHint />
          <Board />
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default App;

import { useEffect } from 'react';
import type { NextPage } from 'next';

import Grid from 'components/Grid';
import Hints from 'components/Hints';

import { useNonogramStore } from 'lib/stores';

const Home: NextPage = () => {
  const { rows, columns, setup, generate, undo } = useNonogramStore();

  useEffect(() => {
    generate();
  }, [generate]);

  return (
    <>
      <style jsx>{`
        .container {
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .inner-container {
          display: flex;
        }

        .bottom-container {
          position: fixed;
          bottom: 10vh;
          display: flex;
        }

        .undo-button,
        .generate-button {
          margin-left: 1rem;
        }
      `}</style>

      <style jsx global>{`
        :root {
          --grid-item-size: ${rows * columns > 25 ? 2.25 : 3}rem;
        }
      `}</style>

      <div className="container">
        <Hints direction="horizontal" />

        <div className="inner-container">
          <Hints direction="vertical" />
          <Grid />
        </div>
      </div>

      <div className="bottom-container">
        <select
          value={rows + 'x' + columns}
          onChange={(e) => {
            const [_rows, _columns] = e.target.value.split('x');
            setup(parseInt(_rows), parseInt(_columns));
          }}
        >
          <option value="5x5">5x5</option>
          <option value="6x6">6x6</option>
          <option value="7x7">7x7</option>
        </select>

        <button className="undo-button" onClick={undo}>
          Undo
        </button>
        <button className="generate-button" onClick={generate}>
          Refresh
        </button>
      </div>
    </>
  );
};

export default Home;

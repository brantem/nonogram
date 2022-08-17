import { useEffect } from 'react';
import type { NextPage } from 'next';

import Grid from 'components/Grid';
import Hints from 'components/Hints';

import { useNonogramStore } from 'lib/stores';

const Home: NextPage = () => {
  const { rows, columns, histories, setup, generate, undo } = useNonogramStore();

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
          display: flex;
          justify-content: space-between;
          border: 1px solid black;
          border-top-width: 0;
          border-radius: 0 0 0.25rem 0.25rem;
        }

        @media (prefers-color-scheme: dark) {
          .bottom-container {
            border-color: white;
          }
        }

        .bottom-container > * {
          flex: 1 0 calc(100% / 3);
          border: 0;
          background: transparent;
          text-align: center;
          height: 2rem;
        }

        .bottom-container select {
          -webkit-appearance: none;
          appearance: none;
        }

        .bottom-container > * + * {
          border-left: 1px solid black;
        }

        @media (prefers-color-scheme: dark) {
          .bottom-container > * + * {
            border-color: white;
          }
        }
      `}</style>

      <style jsx global>{`
        :root {
          --cell-size: ${rows * columns > 25 ? 2.25 : 3}rem;
        }
      `}</style>

      <div className="container">
        <Hints direction="horizontal" />

        <div className="inner-container">
          <Hints direction="vertical" />
          <Grid />
        </div>

        <div className="bottom-container">
          <select
            value={rows + ' × ' + columns}
            onChange={(e) => {
              const [_rows, _columns] = e.target.value.split(' × ');
              setup(parseInt(_rows), parseInt(_columns));
            }}
          >
            <option value="4 × 4">4 × 4</option>
            <option value="5 × 5">5 × 5</option>
            <option value="6 × 6">6 × 6</option>
            <option value="7 × 7">7 × 7</option>
          </select>

          <button className="undo-button" onClick={undo} disabled={!histories.length}>
            Undo
          </button>

          <button className="generate-button" onClick={generate}>
            Refresh
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;

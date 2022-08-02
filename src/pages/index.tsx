import { useEffect } from 'react';
import type { NextPage } from 'next';

import Grid from 'components/Grid';
import Hints from 'components/Hints';

import { useNonogramStore } from 'lib/stores';

const Home: NextPage = () => {
  const { generate } = useNonogramStore();

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

        .generate-button {
          position: fixed;
          bottom: 10vh;
        }
      `}</style>

      <div className="container">
        <Hints direction="horizontal" />

        <div className="inner-container">
          <Hints direction="vertical" />
          <Grid />
        </div>
      </div>

      <button className="generate-button" onClick={generate}>
        Refresh
      </button>
    </>
  );
};

export default Home;

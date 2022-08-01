import { useEffect } from 'react';
import type { NextPage } from 'next';

import Grid from '../components/Grid';
import Hints from '../components/Hints';

import { useNonogramStore } from '../lib/stores';

const Home: NextPage = () => {
  const generate = useNonogramStore((state) => state.generate);

  useEffect(() => {
    generate();
  }, [generate]);

  return (
    <>
      <style jsx>{`
        .generate-button {
          position: fixed;
          bottom: 10vh;
        }
      `}</style>

      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
        <Hints direction="horizontal" />

        <div style={{ display: 'flex' }}>
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

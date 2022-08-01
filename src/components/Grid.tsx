import { useNonogramStore } from '../lib/stores';

const Grid = () => {
  const { rows, columns, grid } = useNonogramStore();

  return (
    <>
      <style jsx>{`
        .grid {
          display: grid;
          grid-template-rows: repeat(${rows}, 2rem);
          grid-template-columns: repeat(${columns}, 2rem);
          grid-gap: 0.5rem;
        }

        .grid-item {
          border-width: 1px;
          border-style: solid;
          border-color: black;
          border-radius: 0.125rem;
          height: 2rem;
          width: 2rem;
          cursor: pointer;
        }

        @media (prefers-color-scheme: dark) {
          .grid-item {
            border-color: white;
          }
        }
      `}</style>

      <div className="grid">
        {grid.map((row, i) => row.map((_, j) => <div className="grid-item" key={'' + i + j} />))}
      </div>
    </>
  );
};

export default Grid;

import { useNonogramStore } from 'lib/stores';

type HintsProps = {
  direction: 'vertical' | 'horizontal';
};

const Hints = ({ direction }: HintsProps) => {
  const { rows, columns, generateHints } = useNonogramStore();
  const hints = generateHints(direction === 'horizontal' ? 'column' : 'row');

  return (
    <>
      <style jsx>{`
        #hints {
          display: grid;
          position: absolute;
          gap: 1px;
        }

        #hints.row {
          grid-template-rows: repeat(${rows}, var(--cell-size));
          margin-right: 0.5rem;
          justify-items: end;
          right: 100%;
        }

        #hints.column {
          grid-template-columns: repeat(${columns}, var(--cell-size));
          margin-bottom: 0.5rem;
          align-self: flex-end;
          align-items: end;
          bottom: 100%;
        }

        .hints-item {
          display: grid;
          color: black;
        }

        @media (prefers-color-scheme: dark) {
          .hints-item {
            color: white;
          }
        }

        #hints.row .hints-item {
          grid-template-columns: repeat(var(--hints-item-lines), 1fr);
        }

        #hints.column .hints-item {
          grid-template-rows: repeat(var(--hints-item-lines), 1fr);
        }

        .hints-item-line {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hints-item-line.is-correct {
          color: hsl(120, 100%, 45%);
        }

        @media (prefers-color-scheme: dark) {
          .hints-item-line.is-correct {
            color: hsl(120, 100%, 80%);
          }
        }

        #hints.row .hints-item-line {
          width: calc(var(--cell-size) - var(--cell-size) / 2);
        }

        #hints.column .hints-item-line {
          height: calc(var(--cell-size) - var(--cell-size) / 3);
        }
      `}</style>

      <div id="hints" className={direction === 'horizontal' ? 'column' : 'row'}>
        {hints.map((hint, i) => (
          <div key={i} className={'hints-item'} style={{ '--hints-item-lines': hint.length } as any}>
            {hint.map((line, j) => (
              <div className={'hints-item-line' + (line[1] === 1 ? ' is-correct' : '')} key={j}>
                {line[0]}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default Hints;

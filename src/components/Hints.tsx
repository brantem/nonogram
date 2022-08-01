import { useNonogramStore } from '../lib/stores';

type HintsProps = {
  direction: 'vertical' | 'horizontal';
};

const Hints = ({ direction }: HintsProps) => {
  const { rows, columns, hints } = useNonogramStore();

  return (
    <>
      <style jsx>{`
        .hints {
          display: grid;
          gap: 0.5rem;
          position: absolute;
        }

        .hints.row {
          grid-template-rows: repeat(${rows}, 2rem);
          margin-right: 0.5rem;
          justify-items: end;
          right: 100%;
        }

        .hints.column {
          grid-template-columns: repeat(${columns}, 2rem);
          margin-bottom: 0.5rem;
          align-self: flex-end;
          align-items: end;
          bottom: 100%;
        }

        .hints-item {
          display: grid;
        }

        .hints.column .hints-item {
          grid-template-rows: repeat(var(--hints-item-lines), 2rem);
        }

        .hints.row .hints-item {
          grid-template-columns: repeat(var(--hints-item-lines), 2rem);
        }

        .hints-item-line {
          color: black;
          text-align: center;
          height: 2rem;
          width: 2rem;
          line-height: 2rem;
        }

        @media (prefers-color-scheme: dark) {
          .hints-item-line {
            color: white;
          }
        }

        .hints-item-line.empty {
          color: gray;
        }
      `}</style>

      <div className={'hints ' + (direction === 'horizontal' ? 'column' : 'row')}>
        {(direction === 'horizontal' ? hints.column : hints.row).map((lines, i) => (
          <div key={i} className="hints-item" style={{ '--hints-item-lines': lines.length } as any}>
            {lines.length > 0 ? (
              lines.map((line, j) => (
                <div className="hints-item-line" key={j}>
                  {line}
                </div>
              ))
            ) : (
              <div className="hints-item-line empty">0</div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default Hints;

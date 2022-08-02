import { useNonogramStore } from 'lib/stores';

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
          grid-template-rows: repeat(${rows}, var(--grid-item-size));
          margin-right: 0.5rem;
          justify-items: end;
          right: 100%;
        }

        .hints.column {
          grid-template-columns: repeat(${columns}, var(--grid-item-size));
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

        .hints.column .hints-item {
          grid-template-rows: repeat(var(--hints-item-lines), var(--grid-item-size));
        }

        .hints.row .hints-item {
          grid-template-columns: repeat(var(--hints-item-lines), var(--grid-item-size));
        }

        .hints-item-line {
          text-align: center;
          height: var(--grid-item-size);
          width: var(--grid-item-size);
          line-height: var(--grid-item-size);
        }

        .hints-item-line.empty {
          color: gray;
        }
      `}</style>

      <div className={'hints ' + (direction === 'horizontal' ? 'column' : 'row')}>
        {(direction === 'horizontal' ? hints.column : hints.row).map((lines, i) => (
          <div key={i} className="hints-item" style={{ '--hints-item-lines': lines.length } as any}>
            {lines.map((line, j) => (
              <div className="hints-item-line" key={j}>
                {line}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default Hints;

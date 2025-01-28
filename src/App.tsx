function App() {
  return (
    <div className="flex h-full flex-col justify-between gap-y-4 sm:gap-y-8">
      <div />

      <div className="grid aspect-square grid-cols-12 grid-rows-10 text-center text-2xl font-semibold tabular-nums md:text-3xl dark:text-white">
        <Top />
        <Left />
        <Board />
      </div>

      <div />
    </div>
  );
}

export default App;

function Top() {
  const data = [
    [0, 2, 1],
    [1, 1, 1],
    [0, 2, 2],
    [0, 1, 2],
    [0, 3, 1],
  ];

  return (
    <div className="col-span-9 col-start-4 row-span-3 flex rounded-t">
      {data.map((rows, i) => (
        <div key={i} className="flex w-1/5 flex-col justify-around pb-1 md:pb-2">
          {rows.map((row, i) => (row ? <span key={i}>{row}</span> : <span key={i}>&nbsp;</span>))}
        </div>
      ))}
    </div>
  );
}

function Left() {
  const data = [
    [0, 0, 5],
    [1, 1, 1],
    [0, 1, 2],
    [0, 1, 2],
    [0, 2, 1],
  ];

  return (
    <div className="col-span-3 row-span-7 row-start-4 flex flex-col rounded-l">
      {data.map((cols, i) => (
        <div key={i} className="grid flex-1 grid-cols-3 items-center pr-1 md:pr-2">
          {cols.map((col, i) => (col ? <span key={i}>{col}</span> : <span key={i} />))}
        </div>
      ))}
    </div>
  );
}

function Board() {
  const data = [
    [1, 1, 1, 1, 1],
    [1, -1, 1, -1, 1],
    [-1, 1, -1, 1, 1],
    [1, -1, 1, 1, -1],
    [-1, 1, 1, -1, 1],
  ];

  return (
    <div className="col-span-9 row-span-7 grid aspect-square grid-rows-5 divide-y rounded-md border-3">
      {data.map((cols, i) => (
        <div key={i} className="grid grid-cols-5 divide-x">
          {cols.map((col, i) => {
            switch (col) {
              case -1:
                return (
                  <div key={i} className="p-1.5">
                    <div className="flex size-full items-center justify-center text-red-500">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="size-3/4">
                        <path
                          d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                  </div>
                );
              case 1:
                return (
                  <div key={i} className="p-1.5">
                    <div className="size-full rounded bg-black dark:bg-white" />
                  </div>
                );
              default:
                return <div key={i} />;
            }
          })}
        </div>
      ))}
    </div>
  );
}

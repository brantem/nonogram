import { Fragment } from 'react';
import { useSnapshot } from 'valtio';

import type * as types from 'types';
import { generateGroups, cn, buttonToValue } from 'lib/helpers';
import * as nonogram from 'lib/nonogram';
import * as selection from 'lib/selection';

export default function Board() {
  const groups = generateGroups(nonogram.settings.height, 5);

  return (
    <div id="board" className="relative border-[2px] border-neutral-500" onContextMenu={(e) => e.preventDefault()}>
      <Selection />

      <div className="flex flex-col divide-y-[3px] divide-neutral-500">
        {groups.map((group, i) => (
          <div key={i} className="relative">
            <div className="flex flex-col divide-y divide-neutral-500">
              {[...new Array(group)].map((_, j) => (
                <Row key={j} y={i * 5 + j} isLast={i === groups.length - 1 && j === group - 1} />
              ))}
            </div>

            <span className="absolute bottom-0 left-[calc(100%+var(--spacing)*2)] text-base leading-none">
              {i * 5 + group}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

enum Direction {
  LR, // left-right
  RL, // right-left
  TB, // top-bottom
  BT, // bottom-top
}

function Selection() {
  const data = useSnapshot(selection.data);
  if (!data.coords.length) return;

  const [[x1, y1], end, direction] = (() => {
    const [start, end] = data.coords;
    const [x1, y1] = start;

    if (!end) return [start, null, Direction.LR];

    const [x2, y2] = end;

    if (x1 > x2) return [end, start, Direction.RL]; // right-left -> left-right
    if (x1 === x2 && y1 > y2) return [end, start, Direction.BT]; // bottom-top -> top-bottom
    return [start, end, x1 === x2 ? Direction.TB : Direction.LR];
  })();
  const [x2, y2] = end || [0, 0];

  const board = document.getElementById('board')?.getBoundingClientRect();
  if (!board) return;

  const cell1 = document.querySelector(`[data-c="${x1}.${y1}"]`)?.getBoundingClientRect();
  const cell2 = end ? document.querySelector(`[data-c="${x2}.${y2}"]`)?.getBoundingClientRect() : cell1;
  if (!cell1 || !cell2) return;

  const distance = (end ? Math.abs(x2 - x1) /* x */ || Math.abs(y2 - y1) /* y */ : 0) + 1;
  const isFirstRow = cell1.top - board.top - 2 /* <Board /> border */ === 0;
  const isHorizontal = direction === Direction.LR || direction === Direction.RL;
  const isVertical = direction === Direction.TB || direction === Direction.BT;

  return (
    <div
      className={cn(
        'pointer-events-none absolute z-10 flex border-[5px] border-yellow-400',
        direction !== Direction.RL && 'justify-end',
        direction === Direction.TB && 'items-end',
      )}
      style={{
        top: cell1.top - board.top - /* <Board /> border */ 2 - /* <Selection /> border */ 5,
        left: cell1.left - board.left - /* <Board /> border */ 2 - /* <Selection /> border */ 5,
        height: cell2.bottom - cell1.top + 10 /* <Selection /> border * 2 */,
        width: cell2.right - cell1.left + 10 /* <Selection /> border * 2 */,
      }}
    >
      {distance > 1 ? (
        <div className={cn('size-9 p-1', isHorizontal && (isFirstRow ? 'mt-9' : '-mt-9'), isVertical && '-mr-9')}>
          <div
            className={cn(
              'flex size-full items-center justify-center rounded border-2 border-black bg-white text-base leading-none',
            )}
          >
            {distance}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Row({ y, isLast }: { y: number; isLast: boolean }) {
  const groups = generateGroups(nonogram.settings.width, 5);

  return (
    <div className="flex divide-x-[3px] divide-neutral-500">
      {groups.map((group, i) => {
        return (
          <div key={i} className="relative">
            <div className="flex items-stretch">
              {[...new Array(group)].map((_, j) => (
                <Fragment key={j}>
                  <Cell x={i * 5 + j} y={y} />

                  {j < group - 1 && <div className="w-px bg-neutral-500" />}
                </Fragment>
              ))}
            </div>

            {isLast && (
              <span className="absolute top-[calc(100%+var(--spacing)*2)] right-0 text-base leading-none">
                {i * 5 + group}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Cell({ x, y }: { x: number; y: number }) {
  const cell = useSnapshot(nonogram.grid)[y][x];

  const coord = [x, y] satisfies types.Coord;
  const isMatch = cell[0] === cell[1];

  // TODO: lock direction

  return (
    <div
      className="cell flex size-(--cell-size) cursor-pointer items-center justify-center bg-white p-0.5 dark:bg-neutral-800"
      data-c={`${x}.${y}`}
      onPointerDown={(e) => {
        let v = buttonToValue(e.button);
        if (v === -1) return;
        if (v === cell[1]) v = -1;
        selection.start(coord, v);
      }}
      onPointerEnter={() => selection.move(coord)}
    >
      {(() => {
        switch (cell[1]) {
          case 0:
            return (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 384 512"
                className={cn('aspect-square', !isMatch && 'text-rose-500')}
              >
                <path
                  d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
                  fill="currentColor"
                />
              </svg>
            );
          case 1:
            return (
              <div className={cn('size-full rounded', isMatch ? 'bg-black dark:bg-neutral-300' : 'bg-rose-500')} />
            );
          default:
            return;
        }
      })()}
    </div>
  );
}

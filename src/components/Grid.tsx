import { Fragment } from 'react';
import { useSnapshot } from 'valtio';

import XMarkIcon from './icons/XMarkIcon';

import type * as types from 'types';
import { generateGroups, cn, buttonToValue } from 'lib/helpers';
import * as nonogram from 'lib/state/nonogram';
import * as highlight from 'lib/state/highlight';
import * as selection from 'lib/state/selection';

export default function Grid() {
  const settings = useSnapshot(nonogram.settings);
  const groups = generateGroups(settings.height, 5);

  return (
    <div
      id="grid"
      className="relative border-[2px] border-neutral-500"
      onContextMenu={(e) => e.preventDefault()}
      onPointerLeave={highlight.clear}
    >
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

  const grid = document.getElementById('grid')?.getBoundingClientRect();
  if (!grid) return;

  const cell1 = document.querySelector(`[data-c="${x1}.${y1}"]`)?.getBoundingClientRect();
  const cell2 = end ? document.querySelector(`[data-c="${x2}.${y2}"]`)?.getBoundingClientRect() : cell1;
  if (!cell1 || !cell2) return;

  const distance = (end ? Math.abs(x2 - x1) /* x */ || Math.abs(y2 - y1) /* y */ : 0) + 1;
  const isFirstRow = cell1.top - grid.top - 2 /* <Grid /> border */ === 0;
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
        top: cell1.top - grid.top - /* <Grid /> border */ 2 - /* <Selection /> border */ 5,
        left: cell1.left - grid.left - /* <Grid /> border */ 2 - /* <Selection /> border */ 5,
        height: cell2.bottom - cell1.top + 10 /* <Selection /> border * 2 */,
        width: cell2.right - cell1.left + 10 /* <Selection /> border * 2 */,
      }}
    >
      {distance > 1 ? (
        <div className={cn('size-9 p-1', isHorizontal && (isFirstRow ? 'mt-9' : '-mt-9'), isVertical && '-mr-9')}>
          <div
            className={cn(
              'flex size-full items-center justify-center rounded border-2 border-black bg-white text-base leading-none dark:border-white dark:bg-black',
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
  const settings = useSnapshot(nonogram.settings);
  const groups = generateGroups(settings.width, 5);

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
      className={cn(
        'cell size-(--cell-size) cursor-pointer bg-white dark:bg-black',
        cell[1] === 0 && 'relative overflow-hidden',
        cell[1] === 1 && 'flex items-center justify-center',
      )}
      data-c={`${x}.${y}`}
      onPointerDown={(e) => {
        let v = buttonToValue(e.button);
        if (v === -1) return;
        if (v === cell[1]) v = -1;
        selection.start(coord, v);
      }}
      onPointerEnter={() => {
        highlight.set(coord);
        selection.move(coord);
      }}
    >
      {(() => {
        switch (cell[1]) {
          case 0:
            return <XMarkIcon className={cn('absolute -inset-1 aspect-square', !isMatch && 'text-rose-500')} />;
          case 1:
            return <div className={cn('size-full', isMatch ? 'bg-black dark:bg-neutral-300' : 'bg-rose-500')} />;
          default:
            return;
        }
      })()}
    </div>
  );
}

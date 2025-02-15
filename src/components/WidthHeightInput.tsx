import { XMarkIcon } from '@heroicons/react/16/solid';

import * as constants from 'constants';

type WidthHeightInputProps = {
  width: {
    value: number;
    onChange(value: number): void;
  };
  height: {
    value: number;
    onChange(value: number): void;
  };
  disabled?: boolean;
};

export default function WidthHeightInput({ width, height, disabled }: WidthHeightInputProps) {
  return (
    <div className="flex w-fit items-center dark:text-white">
      <Input
        type="number"
        min={constants.width.min}
        max={constants.width.max}
        value={width.value}
        onChange={(e) => width.onChange(parseInt(e.target.value))}
        disabled={disabled}
      />

      <XMarkIcon
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        className="size-4 shrink-0 text-neutral-500"
      />

      <Input
        type="number"
        min={constants.height.min}
        max={constants.height.max}
        value={height.value}
        onChange={(e) => height.onChange(parseInt(e.target.value))}
        disabled={disabled}
      />
    </div>
  );
}

function Input(props: Omit<React.ComponentPropsWithoutRef<'input'>, 'className'>) {
  return (
    <input
      {...props}
      className="h-8 w-12 rounded-md border-neutral-200 px-2 text-center text-sm tabular-nums invalid:border-red-500 invalid:ring-red-600 invalid:focus:border-red-600 invalid:focus:ring disabled:opacity-50 max-md:flex-1 dark:border-neutral-800 dark:bg-black"
    />
  );
}

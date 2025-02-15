import clsx, { ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function padStart<T>(arr: T[], len: number, fill: any): T[] {
  return [...new Array(len - arr.length).fill(fill), ...arr];
}

export function generateGroups(n: number, g: number) {
  const result = [];
  while (n > 0) {
    result.push(Math.min(g, n));
    n -= g;
  }
  return result;
}

export function buttonToValue(button: number): -1 | 0 | 1 {
  switch (button) {
    case 0:
      return 1;
    case 2:
      return 0;
    default:
      return -1;
  }
}

export const sleep = async (value: number) => {
  return await new Promise((resolve) => setTimeout(resolve, value));
};

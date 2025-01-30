import clsx, { ClassValue } from 'clsx';

export const cn = (...inputs: ClassValue[]) => {
  return clsx(inputs);
};

export const padStart = <T>(arr: T[], len: number, fill: any): T[] => {
  return [...new Array(len - arr.length).fill(fill), ...arr];
};

export const padStart = (arr: any[], len: number, fill: any) => {
  return [...new Array(len - arr.length).fill(fill), ...arr];
};

export const loop = async <T>(n: number, cb: (i: number) => Promise<T>): Promise<T[]> => {
  const result: T[] = [];
  for (let i = 0; i < n; i++) {
    result.push(await cb(i));
  }
  return result;
};
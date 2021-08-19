export const sleep = async (time: number): Promise<void> =>
  new Promise((r): number => setTimeout(r, time))

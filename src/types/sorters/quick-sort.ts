export type QuicksortFrameState = {
  items: number[];
  swapCount: number;
  compareCount: number;
  verifyAt?: number;
  compared?: number[];
  swapped?: number[];
  terminals?: number[];
  key?: number;
  partition?: number;
};

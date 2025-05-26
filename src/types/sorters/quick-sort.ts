export type QuicksortFrameState = {
  items: number[];
  swapCount: number;
  comparisonCount: number;
  verify?: number;
  compared?: number[];
  swapped?: number[];
  terminals?: number[];
  key?: number;
  partition?: number;
};

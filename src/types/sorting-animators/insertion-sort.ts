export type InsertionSortFrameState = {
  items: number[];
  swapCount: number;
  compareCount: number;
  verifyAt?: number;
  compared?: number[];
  swapped?: number[];
  leftBound?: number;
  key?: number;
};

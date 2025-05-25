export type InsertionSortFrameState = {
  items: number[];
  swapCount: number;
  compareCount: number;

  verify?: number;
  compared?: number[];
  swapped?: number[];
  leftBound?: number;
  key?: number;
};

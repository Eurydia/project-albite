export type SelectionSortFrameState = {
  items: number[];
  swapCount: number;
  compareCount: number;
  compared?: number[];
  swapped?: number[];
  key?: number;
  leftBound?: number;
  verify?: number;
};
